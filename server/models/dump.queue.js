const { isTheDatabaseUsed } = require('../commands/dumps-queue');
const { doDump } = require('../commands/dump');

class DumpQueue {
    constructor() {
        this.dump_queue = [];
    }

    async addItem(dump) {
        let isExistWorkspace = false;

        const canDump = await this.tryDump(dump);
        if (!canDump) {
            this.dump_queue.forEach((key) => {
                if (Object.keys(key)[0] === dump.dumpDetails.workspace_to_dump) {
                    Object.values(key)[0].push(dump);
                    isExistWorkspace = true;
                }
            });

            if (!isExistWorkspace) {
                this.dump_queue = [...this.dump_queue, {
                    [dump.dumpDetails.workspace_to_dump]: [dump],
                }];
            }
        }
        dump.finish.on('remove', _ => {
            this.dump_queue.removeItem(dump);
        });
    }

    async removeItem(dump) {
        for (let i = 0; i < Object.values(this.dump_queue).length; i += 1) {
            if (Object.keys(Object.values(this.dump_queue)[i])[0] === dump.dumpDetails.workspace_to_dump) {
                if (Object.values(Object.values(this.dump_queue)[i])[0].length === 1) { this.dump_queue.splice(i, 1); } else {
                    const removeDumpIndex = Object.values(Object.values(this.dump_queue)[i])[0].findIndex((removeDump) => JSON.stringify(removeDump.dumpDetails) === JSON.stringify(dump.dumpDetails));
                    Object.values(Object.values(this.dump_queue)[i])[0].splice(removeDumpIndex, 1);
                }
            }
        }
    }

    async emitNextDump(workspace) {
        for (let i = 0; i < Object.values(this.dump_queue).length; i += 1) {
            if (Object.keys(Object.values(this.dump_queue)[i])[0] === workspace) {
                Object.values(Object.values(this.dump_queue)[i])[0].forEach((tryEmitNext) => {
                    const canDump = this.tryDump(tryEmitNext);
                    if (canDump) return;
                });
            }
        }
    }

    async dump(dump) {
        const dumpResult = await doDump(dump);
        dump.finish.emit('finish', dumpResult);
        this.removeItem(dump);
        this.emitNextDump(dump.dumpDetails.workspace_to_dump);
    }

    async tryDump(dump) {
        const cantDoDump = await isTheDatabaseUsed(dump.dumpDetails);
        return !cantDoDump ? this.dump(dump) : false;
    }
}

const instance = new DumpQueue();
module.exports = instance;
