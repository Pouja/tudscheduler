# TUD Scheduler
Helps you to organize/select/overview your TU Delft Master courses and to generate/submit your master application form.  
This is the frontend part of it.

# Developing
Clone the repo, install the dependencies `npm install` and use `npm start` to start the webpack dev server. 
Includes the hot module reload feature. 
You will need the mock server as well `npm run mock-server`.    
`npm run build` To build the frontend to the build directory.  
`npm run zip` To zip the build with the version number.  
`npm lint` To run eslint, when commit'ing it should pass this.  

# Todo
* Create a snackbar for communicating server requests (like 'saved', 'error when saving' etc.)
* Remove localhost:8000 when building
* Rename IspPanel to CategoryPanel
* Rename ISPCtrl to CategoryCtrl
* Rename ISPField to Category
* Make everything drag n drop!
* Change row height react-grid-layout on mobile
* Add shouldComponentUpdate everywhere
* Make the sidebar a drawer
* Add indication when request to backend server fails
* Split the webpack.config file
* IspPanel and Sidebar can be merged togheter
* SidebarSearchBody and IspPanelBody can be merged
* SidebarHeader and IspPanelHeader can be merged
* Rename event 'added' to 'added::${courseId}' same for remove
* Move the visibilty of the tree into the CourseCtrl.tree
* Make the naming of events consistent: entity::action::id, so for example course::added:3150 and category::changed::3

# LICENSE
See the LICENSE file.
