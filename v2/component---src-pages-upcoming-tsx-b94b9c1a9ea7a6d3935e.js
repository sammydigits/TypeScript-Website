(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"4+/V":function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var n=a("ERkP"),r=a("Wbzz"),s=a("5psB"),i=a("7ScH"),l=a("I56Z"),c=a("yVh0"),o=function(){var e=Object(c.a)(),t=Object(l.a)(e),a=new Date(i.last_release_date),o=new Date(i.upcoming_beta_date),m=new Date(i.upcoming_rc_date),p=new Date(i.upcoming_release_date),u=new Date;!function(e,t,a,n){if(!(e&&t&&a&&n)){var r=[{name:"startDate",date:e},{name:"betaDate",date:t},{name:"rcDate",date:a},{name:"releaseDate",date:i}].filter((function(e){return!e.date}));throw new Error("Dates in release-plan.json can't be converted into JS dates: "+r.join(" - "))}}(a,o,m,p);var d=Math.round(Math.abs((+a-+p)/864e5)),v=Math.round(Math.abs((+a-+o)/864e5)),_=Math.round(Math.abs((+a-+m)/864e5)),h=Math.round(Math.abs((+a-+u)/864e5)),b=-1;if(h>d||h<0);else if(h<v){b=h/v*.55*100}else if(h<_){b=h/_*.28*100+55}else{b=h/d*.17*100+83}var f=e.formatDateToParts(a,{month:"short",day:"numeric"}),y=e.formatDateToParts(o,{month:"short",day:"numeric"}),E=e.formatDateToParts(m,{month:"short",day:"numeric"}),g=e.formatDateToParts(p,{month:"short",day:"numeric"}),w=n.createElement("a",{href:i.iteration_plan_url},i.upcoming_version),N=n.createElement("a",{href:Object(r.withPrefix)(s.releaseNotesURL)},t("index_releases_released")),M=s.isBeta?n.createElement("a",{href:s.betaPostURL},t("index_releases_beta")):n.createElement("span",null,t("index_releases_beta")),D=s.isRC?n.createElement("a",{href:s.rcPostURL},t("index_releases_rc")):n.createElement("span",null,t("index_releases_rc"));return n.createElement("div",{className:"grey-box last"},n.createElement("p",null,t("index_releases_pt1")," ",w,t("index_releases_pt2")," ",g.map((function(e){return e.value})).join("")),n.createElement("div",{className:"release-info"},n.createElement("div",{className:"needle",style:{left:b+"%",display:-1===b?"none":"block"}}),n.createElement("div",{className:"needle-head",style:{left:b+"%",display:-1===b?"none":"block"}}),n.createElement("div",{className:"release"},n.createElement("div",null,n.createElement("div",{className:"separator"}),n.createElement("div",{className:"bar"})),n.createElement("p",null,s.tags.stableMajMin," ",N,n.createElement("br",null),f.map((function(e){return e.value})).join(""))),n.createElement("div",{className:"beta"},n.createElement("div",null,n.createElement("div",{className:"separator"}),n.createElement("div",{className:"bar"})),n.createElement("p",null,i.upcoming_version," ",M,n.createElement("br",null),y.map((function(e){return e.value})).join(""))),n.createElement("div",{className:"rc"},n.createElement("div",null,n.createElement("div",{className:"separator"}),n.createElement("div",{className:"bar"})),n.createElement("p",null,i.upcoming_version," ",D,n.createElement("br",null),E.map((function(e){return e.value})).join("")))))}},"5psB":function(e){e.exports=JSON.parse('{"_generated by":"node packages/typescriptlang-org/scripts/getTypeScriptNPMVersions.js","tags":{"stableMajMin":"3.9","stable":"3.9.2","betaMajMin":"3.9","beta":"3.9.0-beta","rc":"3.9.1-rc","rcMajMin":"3.9"},"isRC":false,"isBeta":false,"releaseNotesURL":"/docs/handbook/release-notes/typescript-3-9.html","betaPostURL":"https://devblogs.microsoft.com/typescript/announcing-typescript-3-9-beta/","rcPostURL":"https://devblogs.microsoft.com/typescript/announcing-typescript-3-9-rc/","vs":{"stable":{"vs2017_download":"https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-39rc","vs2019_download":"https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-39rc"},"beta":{"vs2017_download":"https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-39rc","vs2019_download":"https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-39rc"},"rc":{"vs2017_download":"https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-39beta","vs2019_download":"https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-39beta"}}}')},"7ScH":function(e){e.exports=JSON.parse('{"_format":"mm/dd/yyyy - these get put into new Date()","upcoming_version":"3.9","iteration_plan_url":"https://github.com/microsoft/TypeScript/issues/37198","last_release_date":"02/20/2020","upcoming_beta_date":"03/24/2020","upcoming_rc_date":"04/28/2020","upcoming_release_date":"05/12/2020"}')},k5js:function(e,t,a){"use strict";a.r(t),a.d(t,"query",(function(){return m}));var n=a("ERkP"),r=a("9Dj+"),s=a("GO2c"),i=a("4+/V"),l=a("yVh0"),c=(a("l6HP"),a("7ScH")),o=function(e){var t=Object(l.a)(),a=new Date,s=new Date(c.last_release_date),o=new Date(c.upcoming_beta_date),m=new Date(c.upcoming_rc_date),p=new Date(c.upcoming_release_date),u=Math.round(Math.abs((+s-+p)/864e5)),d=Math.round(Math.abs((+s-+o)/864e5)),v=Math.round(Math.abs((+s-+m)/864e5)),_=Math.round(Math.abs((+s-+a)/864e5)),h=t.formatDateToParts(o,{month:"short",day:"numeric"}).map((function(e){return e.value})).join(""),b=t.formatDateToParts(m,{month:"short",day:"numeric"}).map((function(e){return e.value})).join(""),f=t.formatDateToParts(p,{month:"short",day:"numeric"}).map((function(e){return e.value})).join(""),y="Up next: "+(_>u||_<0?"Preparing details for the next release":_<d?c.upcoming_version+" Beta on "+h:_<v?c.upcoming_version+" RC on "+b:c.upcoming_version+" Final release on "+f);return n.createElement(n.Fragment,null,n.createElement(r.a,{title:"Release Cycle",description:y,lang:"en",allSitePage:e.data.allSitePage},n.createElement("div",{id:"upcoming"},n.createElement("div",{className:"raised content main-content-block"},n.createElement("div",{className:"split-sixhundred"},n.createElement("h1",{style:{marginTop:"20px"}},"Release Cycle"),n.createElement("div",{id:"index"},n.createElement(i.a,null)))))))};t.default=function(e){return n.createElement(s.a,{locale:"en"},n.createElement(o,e))};var m="855333640"}}]);
//# sourceMappingURL=component---src-pages-upcoming-tsx-b94b9c1a9ea7a6d3935e.js.map