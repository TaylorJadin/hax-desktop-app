const fs = require('fs')
const path = require('path')
const Case = require('case')
const setOutline = require('./setOutline')
const unusedFilename = require('unused-filename');
const filenamify = require('filenamify')

/**
 * Takes a path
 * @param {string} location 
 * @param {Outline.tree} outlineTree 
 * 
 * @return {Outline}
 */
module.exports = (newOutline, oldOutline) => {
  // array of Ids in new outline
  const newIds = newOutline.tree.map(o => o.id);
  // array of Ids in old outline
  const oldIds = oldOutline.tree.map(o => o.id);
  // find new items added
  const addedIds = newIds.filter(newId => !oldIds.includes(newId));
  // find items deleted
  const deletedIds = oldIds.filter(oldId => !newIds.includes(oldId))

  // remove new files that have been removed to the outline
  const deletedFiles = deletedIds.map(id => {
    // get the full item from the oldOutline
    const deletedItem = oldOutline.tree.find(item => item.id === id)
    // delete the file
    fs.unlinkSync(deletedItem.location)
    return deletedItem.location
  })

  // add new files that have been added to the outline
  const newOutlineTree = newOutline.tree.map(i => {
    // find out if it's a new item
    const newItem = addedIds.includes(i.id);
    if (newItem) {
      // get the unique filename
      const safeFilename = filenamify(i.title,  {replacement: ''})
      // create a new uniqueFilename. Make sure it's content directory
      const uniqueFilename = unusedFilename.sync(path.join(newOutline.projectLocation, 'content', `${safeFilename}.html`))
      const fileAdded = fs.writeFileSync(uniqueFilename, '', 'utf8')
      // if we successfully added the file then we'll update 
      // the item to know about the new location
      const newLocation = path.relative(newOutline.projectLocation, uniqueFilename);
      i.location = newLocation;
    }
    return i;
  })


  // update the outline file.
  return Object.assign({}, newOutline, { tree: newOutlineTree });
}
