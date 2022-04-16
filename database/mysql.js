var mysql = require('mysql')
var Warpper = require('./database-wrapper')
var schema = require('fs').readFileSync(__dirname + '/../database-schema/mysql.sql').toString()
var log = require('../helper/log')

function init(options){
    if (options.host && options.user && options.dbname){
        let db = mysql.createConnection({
            host     : options.host,
            user     : options.user,
            password : options.password,
            multipleStatements: true
        });

        db.connect(err => {
            if (err){
                log.error('Cannot connect mysql database')
                log.error(err);
                process.exit()
            }
        })

        db.query(`CREATE DATABASE IF NOT EXISTS \`${options.dbname}\``, (err, rows, fields) => {
            if (err){
                log.error('Fail to create database')
                log.error(err)
                process.exit()
            }
        })
        db.query(`USE \`${options.dbname}\``, (err, rows, fields) => {
            if (err){
                log.error('Fail to use database')
                log.error(err)
                process.exit()
            }
        })
        let newSchema = schema.replace(/\n/g, '').replace(/\r/g, '')
        db.query(schema, (err, rows, fields) => {
            if (err){
                log.error('Fail to init table')
                log.error(err)
                process.exit()
            }
        })

        return new MySqlWrapper(db)
    }else{
        throw new Error('Missing some MySql configuration item')
    }
}

class MySqlWrapper extends Warpper {
    query(sql, params){
        return new Promise((resolve, reject) => {
            this._db.query(sql, params, (err, rows, fields) => {
                if (err){
                    log.error("Error while executing SQL: " + sql + params)
                    log.error(err)
                    reject(err)
                }else{
                    log.debug("SQL: " + sql + params)
                    log.debug("Result:", rows)
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = {init}