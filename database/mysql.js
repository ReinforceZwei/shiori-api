var mysql = require('mysql')
var Warpper = require('./database-wrapper')
var schema = require('fs').readFileSync('../database-schema/mysql.sql').toString()

function init(options){
    if (options.host && options.user && options.password && options.database){
        let db = mysql.createConnection({
            host     : options.host,
            user     : options.user,
            password : options.password,
            multipleStatements: true
        });

        db.connect(err => {
            if (err){
                console.log('Cannot connect mysql database')
                console.error(err);
                process.exit()
            }
        })

        db.query(`CREATE DATABASE IF NOT EXISTS \`${options.database}\``, (err, rows, fields) => {
            if (err){
                console.log('Fail to create database')
                console.error(err)
                process.exit()
            }
        })
        db.query(`USE \`${options.database}\``, (err, rows, fields) => {
            if (err){
                console.log('Fail to use database')
                console.error(err)
                process.exit()
            }
        })
        let newSchema = schema.replace(/\n/g, '').replace(/\r/g, '')
        db.query(schema, (err, rows, fields) => {
            if (err){
                console.log('Fail to init table')
                console.error(err)
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
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = {init}