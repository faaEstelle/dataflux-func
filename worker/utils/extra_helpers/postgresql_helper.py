# -*- coding: utf-8 -*-

# Builtin Modules
import re
import datetime
import traceback

# 3rd-party Modules
import psycopg2
from DBUtils.PersistentDB import PersistentDB
from DBUtils.PooledDB import PooledDB

# Project Modules
from worker import celeryconfig
from worker.utils import toolkit
from worker.utils.extra_helpers import format_sql_v2 as format_sql
from worker.utils.extra_helpers import to_db_res_dict

def get_config(c):
    config = {
        'host'           : c.get('host') or '127.0.0.1',
        'port'           : c.get('port') or 5432,
        'user'           : c.get('user'),
        'password'       : c.get('password'),
        'dbname'         : c.get('dbname') or c.get('database'),
        'client_encoding': c.get('charset') or 'utf8',
    }
    return config

class PostgreSQLHelper(object):
    def __init__(self, logger, config, database=None, pool_size=None, *args, **kwargs):
        self.logger = logger

        self.skip_log = False

        if database:
            config['dbname'] = database

        if pool_size:
            config['maxconnections'] = pool_size

        self.config = config
        if pool_size:
            self.client = PooledDB(psycopg2, **get_config(config))
        else:
            self.client = PersistentDB(psycopg2, **get_config(config))

    def __del__(self):
        pass

    def check(self):
        try:
            self.query('SELECT 1')

        except Exception as e:
            for line in traceback.format_exc().splitlines():
                self.logger.error(line)

            raise Exception(str(e))

    def start_trans(self):
        if not self.skip_log:
            self.logger.debug('[POSTGRESQL] Trans START')

        conn = self.client.connection()
        cur  = conn.cursor()

        trans_conn = {
            'conn': conn,
            'cur' : cur,
        }

        return trans_conn

    def commit(self, trans_conn):
        if not trans_conn:
            return

        if not self.skip_log:
            self.logger.debug('[POSTGRESQL] Trans COMMIT')

        conn = trans_conn.get('conn')
        cur  = trans_conn.get('cur')

        conn.commit()

        cur.close()
        conn.close()

    def rollback(self, trans_conn):
        if not trans_conn:
            return

        if not self.skip_log:
            self.logger.debug('[POSTGRESQL] Trans ROLLBACK')

        conn = trans_conn.get('conn')
        cur  = trans_conn.get('cur')

        conn.rollback()

        cur.close()
        conn.close()

    def _trans_execute(self, trans_conn, sql, sql_params=None):
        formatted_sql = format_sql(sql, sql_params)

        if not self.skip_log:
            self.logger.debug('[POSTGRESQL] Trans Query `{}`'.format(re.sub('\s+', ' ', formatted_sql, flags=re.M)))

        if not trans_conn:
            raise Exception('Transaction not started')

        conn = trans_conn['conn']
        cur  = trans_conn['cur']

        count  = cur.execute(formatted_sql)
        db_res = cur.fetchall()

        db_res = to_db_res_dict(cur, db_res)
        return list(db_res), count

    def _execute(self, sql, sql_params=None):
        formatted_sql = format_sql(sql, sql_params)

        if not self.skip_log:
            self.logger.debug('[POSTGRESQL] Query `{}`'.format(re.sub('\s+', ' ', formatted_sql, flags=re.M)))

        conn = None
        cur  = None

        try:
            conn = self.client.connection()
            cur  = conn.cursor()

            count  = cur.execute(formatted_sql)
            db_res = cur.fetchall()

        except Exception as e:
            for line in traceback.format_exc().splitlines():
                self.logger.error(line)

            if conn:
                conn.rollback()

            raise

        else:
            conn.commit()

            db_res = to_db_res_dict(cur, db_res)
            return list(db_res), count

        finally:
            if cur:
                cur.close()

            if conn:
                conn.close()

    def trans_query(self, trans_conn, sql, sql_params=None):
        result, count = self._trans_execute(trans_conn, sql, sql_params)
        return result

    def trans_non_query(self, trans_conn, sql, sql_params=None):
        result, count = self._trans_execute(trans_conn, sql, sql_params)
        return count

    def query(self, sql, sql_params=None):
        result, count = self._execute(sql, sql_params)
        return result

    def non_query(self, sql, sql_params=None):
        result, count = self._execute(sql, sql_params)
        return count

    def dump_for_json(self, val):
        '''
        Dump JSON to string
        '''
        return toolkit.json_dumps(val)
