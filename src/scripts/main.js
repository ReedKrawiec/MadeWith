let Vue = require("./libs/vue.js");
//http://stackoverflow.com/users/488828/joan
const httpGet = (theUrl, callback)=>{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
httpGet("https://reedkrawiec.github.io/MadeWith/projects.json",(data)=>{
  let entries = JSON.parse(data);
  Vue.component("entry-container",{
  template:`
  <div>
    <div class='entries-container' v-for="entry in entries">
      <entry :entry="entry"></entry>
    </div>
  </div>
  `,
  props:["entries"],
  components:{
    entry:{
      template:`
      <div v-on:click="open = !open" v-on:mouseleave="open = false" class='entry'>
        <NameBar :name="entry.name" :lang="entry.lang"></NameBar>  
        <div class="entry__content" :class="{ active: open }">
          <p class="content__tags">
            <span>Tags:</span>
            <TagList :tags="entry.tags"></TagList>
          </p>
          <div class="content__lowerbar">
            <Description :desc="entry.desc"></Description>
            <Links :author="entry.author" :links="entry.sites"></Links>
          </div>
        </div>
      </div>
      `,
      props:["entry"],
      data:()=>{
        return{
          open:false
        }
      }, 
      components:{
        Description:{
          template:`
          <div class="content__desc">
            <p>{{desc}}</p>
          </div>`,
          props:["desc"]
        },
        Links:{
          template:`
          <div class="content__links">
            <div class="link">
              <span>{{author}}</span>
              <span class="link__label">Author</span>
            </div>
            <a v-for="site in links" :href="site.link" class="link">
              <span>{{site.name}}</span>
              <div class="link__hoverbar"></div>
            </a>
          </div>  
          `,
          props:["links","author"]
        },
        NameBar:{
          template:`
          <div class='bar'>
            <span class='title'>{{name}}</span>
            <span class='lang'>{{lang}}</span>
          </div>`,
          props:["name","lang"]
        },
        TagList:{
          template:`
          <span>
            <span class="tag" v-for="tag in tags">
              <span class="tag__text">{{tag}}</span>
            </span> 
          </span> 
          `,
          props:["tags"]
        }
      }
    }
  } 
  });
  new Vue({
    el:"#appRoot",
    data:()=>{
      return {
        entries:entries,
        search_string:""
      }
    },
    computed:{
      filterEntries:function(){  
        let entries_passed = []
        entries.forEach((entry,index)=>{
          let passed_bool = false;
          if(entry.name.toLowerCase().indexOf(this.search_string)>-1)
            passed_bool = true;
            
          if(entry.lang.toLowerCase().indexOf(this.search_string)>-1)
            passed_bool = true;  
          if(entry.author.toLowerCase().indexOf(this.search_string)>-1)
            passed_bool = true;  
          entry.tags.forEach((tag)=>{
            if(tag.toLowerCase().indexOf(this.search_string)>-1)
              passed_bool = true;  
          })  
          if(passed_bool)
            entries_passed.push(entries[index]);  
        })
        return entries_passed;
      }
    },
    methods:{
      setString:function(e){
        this.search_string=e.target.value.toLowerCase();
      }
    },
  });
})
