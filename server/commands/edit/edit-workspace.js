require('dotenv').config()
const fs = require('fs');

const errorMessage = require('../../config/errorMessage.json');
const logger = require('../../services/loggerService');
const logDetailsObj = require('../../classes/details-for-log');

const WORKSPACES = process.env.WORKSPACES || `config/workspaces-configuration.json`;
const MONGO_NAME = process.env.MONGO_NAME || 'databse'

class EditWorkspace {

    constructor(data) {
        if (data.workspaceUrl.indexOf('localhost')!==-1)
            data.workspaceUrl.replace('localhost', MONGO_NAME)
        this.name = data.workspaceName;
        this.url = data.workspaceUrl;
        this.config = WORKSPACES;
        this.workspaceConfig = JSON.parse(fs.readFileSync(this.config, 'utf8'));
        this.isSucceeded = { isSucceeded: true };
    }

    async addWorkspace() {
        try {
            Object.entries(this.workspaceConfig).filter(([key, value]) => {
                if (value === this.url) {
                    this.isSucceeded = { isSucceeded: true, errorMsg: errorMessage.ERR_3 };
                }
                if (key === this.name) {
                    this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_4 };
                }
            });
        } catch {
            this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_1 };
        }
        if (this.isSucceeded.isSucceeded) {
            try {
                this.workspaceConfig[this.name] = this.url;
                fs.writeFileSync(this.config, JSON.stringify(this.workspaceConfig), 'utf8');
                if (!this.isSucceeded.errorMsg) {
                    this.isSucceeded = { isSucceeded: true };
                }
            } catch (error) {
                this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_5 };
            }
        }
        const data = new logDetailsObj('AddWorkspace', 'Adding a new environment to a configuration file', true);
        logger.info({ ...data, The_environment_added: '' });
        return this.isSucceeded;
    }

    async removeWorkspace() {
        if (this.workspaceConfig[this.name] && this.workspaceConfig[this.name] === this.url) {
            try {
                delete this.workspaceConfig[this.name];
                fs.writeFileSync(this.config, JSON.stringify(this.workspaceConfig), 'utf8');
                this.isSucceeded = { isSucceeded: true };
            } catch {
                this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_6 };
            }
        }
        else {
            this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_1 };
        }
        const data = new logDetailsObj('removeWorkspace', 'Removing an environment from a configuration file', true);
        logger.info({ ...data, The_environment_removed: '' });
        return this.isSucceeded;
    }

    async changeWorkspace(newData) {
        const newName = newData.newWorkspaceName;
        const newUrl = newData.newWorkspaceUrl;
        const saveName = this.name;
        const saveUrl = this.url;
        try {
            if (newUrl !== this.url && newName === this.name) {
                this.workspaceConfig[this.name] = newUrl;
                fs.writeFileSync(this.config, JSON.stringify(this.workspaceConfig), 'utf8');
                this.isSucceeded = { isSucceeded: true };
            }
            else {
                if (newName)
                    this.name = newName;
                if (newUrl)
                    this.url = newUrl;

                let responseAdd = await this.addWorkspace();
                if (responseAdd.isSucceeded) {
                    this.name = saveName;
                    this.url = saveUrl;
                    let responseRemove = await this.removeWorkspace();
                    if (responseRemove.isSucceeded)
                        this.isSucceeded = { isSucceeded: true };
                    else {
                        this.name = newName;
                        this.url = newUrl;
                        responseRemove = await this.removeWorkspace();
                        this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_7 };
                    }
                }
                else
                    this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_7 };
            }
        } catch {
            this.isSucceeded = { isSucceeded: false, errorMsg: errorMessage.ERR_7 };
        }
        return this.isSucceeded;
    }
}

module.exports = EditWorkspace;
