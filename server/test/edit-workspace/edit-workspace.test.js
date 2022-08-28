const fs = require('fs');

const EditWorkspace = require('../../commands/edit/edit-workspace');

describe('check edit workspace', () => {

    let data = { workspaceName: "try", workspaceUrl: "trytrytrytry" };
    let edit = new EditWorkspace(data);
    edit.config = "test/edit-workspace/json-file.json";
    edit.workspaceConfig = JSON.parse(fs.readFileSync("test/edit-workspace/json-file.json", 'utf8'));

    it('check add workspace to file', async () => {
        await edit.addWorkspace();
        expect(fs.existsSync(edit.config)).toBe(true);
        expect(fs.readFileSync(edit.config, 'utf-8')).toEqual(
            JSON.stringify({
                try: "trytrytrytry"
            }))
    });

    it('check changeWorkspace workspace to file', async () => {
        edit.name = "try";
        edit.url = "trytrytrytry"
        await edit.changeWorkspace({ newWorkspaceName: "try2", newWorkspaceUrl: "trytrytry2" });
        expect(fs.existsSync(edit.config)).toBe(true);
        expect(fs.readFileSync(edit.config, 'utf-8')).toEqual(
            JSON.stringify({
                try2: "trytrytry2"
            }))
    });

    it('check remove workspace to file', async () => {
        edit.name = "try2";
        edit.url = "trytrytry2"
        await edit.removeWorkspace();
        expect(fs.existsSync(edit.config)).toBe(true);
        expect(fs.readFileSync(edit.config, 'utf-8')).toEqual(
            JSON.stringify({
            }))
    });
});
