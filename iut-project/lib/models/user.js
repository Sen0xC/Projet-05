'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const EmailService = require('../services/email');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            email: Joi.string().email(),
            password: Joi.string(),
            username: Joi.string(),
            roles: Joi.array().items(Joi.string()).default(['user']),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    async $afterInsert(queryContext) {
        try {
            const emailService = new EmailService();
            await emailService.sendWelcomeEmail(this);
        }
        catch (error) {
            console.error('Failed to send welcome email:', error);
            // We don't throw the error here to prevent rolling back the user creation
        }
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

    static get jsonAttributes(){

        return ['roles']
    }


};
