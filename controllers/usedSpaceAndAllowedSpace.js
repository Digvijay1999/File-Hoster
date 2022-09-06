const getAllowedSpace = require('./Admin/getCurrentAllowedSpace');
const getUsedSpace = require('./Admin/gettotalspaceusedbyuser');

async function getData(user_id) {
    const obj = {}
    const space = await getAllowedSpace.getAllowedSpace(user_id);
    obj.allowedSpace = space;
    const usedSpace = await getUsedSpace.totalusedspace(user_id);
    obj.usedSpace = usedSpace
    return obj;
}

module.exports = {
    getData
}