const express = require('express');

const EditWorkspace = require('../commands/edit/edit-workspace');

const router = express.Router();

router.post('/add_workspace', async (req, res) => {
    try {
        let data = new EditWorkspace(req.body);
        let responeAddWorkspace = await data.addWorkspace();
        res.send(responeAddWorkspace);
    } catch (error) {
        throw error;
    };
})

router.post('/remove_workspace', async (req, res) => {
    try {
        let data = new EditWorkspace(req.body);
        let responeRemoveWorkspace = await data.removeWorkspace();
        res.send(responeRemoveWorkspace);
    } catch (error) {
        throw error;
    };
});

router.post('/change_workspace', async (req, res) => {
    try {
        let data = new EditWorkspace(req.body)
        let responeChangeWorkspace = await data.changeWorkspace({ newWorkspaceName: req.body.newWorkspaceName, newWorkspaceUrl: req.body.newWorkspaceUrl });
        res.send(responeChangeWorkspace);
    } catch (error) {
        throw error;
    };
});

module.exports = router;
