application scheduler

page root(){
  head{
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>"Unischeduler"</title>
    includeCSS("main.css")
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
  }
  <div id="react"></div>
  <script type="text/javascript" src="javascript/app.js"></script>
  var s := ""
  form{
    input(s)[id="iep-data",style="display:none;"]
    submit action{
      log(s);

    replace(ph); }[id="iep-store",ajax /*,style="display:none;"*/]{ "Save" }
    submit action{
      log(s);
      //save in session
      selectediep.json := s;
      return login();
    }[id="iep-store" ]{ "Login" }
  }
  placeholder ph {}
  //<a class="nav" href="..."/>
}

session selectediep{
  json : String
}
page login(){}

service data(json: String, trackid:String){
  if(json == "basic.json"){  // ->  courses/:masterid     geeft alle vakken van master erboven terug
    return JSONArray("[{'name':'root','id':'root'},{'name':'EWI4000','id':36583,'courseName':'Master Kick-off','ects':'0','Education Period':'1','Start Education':'1'}]");
  }
  if(json == "tree.json"){  // -> courseTree/:masterid     geeft alle vakken van master erboven terug
    return JSONObject("{'id':'root','children':[{'id':36583,'children':[]}]}");
  }
  // detail info course
}


//
/*
api voor msc

faculteit EWI / AE / ..
masters CS / AM / ..
track per jaar (alles waar een form voor is)

van de server naar client, json met "masters"

[{
  facultyId:1,
  name:'EWI',
  masters: [{masterid:, name:"cs", tracks:[{trackid:1,year:"2015",name:"ST",selected:"true", categories:[{id:,name:"compulsory"}]]}]
}]



//  selectOptions: {IspCourse}  zit in tree encoded

3 dropdowns
default zetten op selected

Computer science 2015
=====
ST
DS&T (MKT)

Computer science 2016
=====
ST
DS&T (MKT)







api voor checks response

[{
  groupId:1,
  errors: [At least 5 courses needed]
},{
  courseId:1,
  errors:['this course is not allowed here']

}
,{
   masterId:1
   errors:["need 120 EC"]
 }
]

geen info toggle button

*/


/*
save naar server, persisten en dan login, maar ook onthefly checks op restricties door server bepaalt


[
  {
    catid:1
    courses:["1"]    // interne ids niet course codes
  }

  {
    catid:"unlisted"   //special case
    courses:["1"]
  }

]

*/


/*
 server-side

 custom course toevoegen form
 en die meegeven als die gebruiker inlogged en gaat schedulen

 coursecode = userid + "iets"

 custom courses hoef je niet op te zoeken dus geen standaard course entity

expliciet allowen in categories
*/


/*
nu nog niet

autofill
alle compulsory courses erin zetten, automatisch in unlisted
mass addition
*/



/*
tabjes voor select en year pagina's
*/
