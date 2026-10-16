/* Guide content: trackpad gestures, shortcuts and how-tos. */
window.GUIDE=(function(){
  /* ---------- trackpad helpers ---------- */
  var row=function(n,cx,cy,g){var a=[];for(var i=0;i<n;i++)a.push([cx+(i-(n-1)/2)*g,cy]);return a};
  var col=function(n,cx,cy,g){var a=[];for(var i=0;i<n;i++)a.push([cx,cy+(i-(n-1)/2)*g]);return a};
  var mv=function(p,dx,dy){return p.map(function(q){return{x:q[0],y:q[1],dx:dx,dy:dy}})};
  var conv=function(outer,c,spread){return outer.map(function(q){
    var ix=c[0]+(q[0]-c[0])*.3,iy=c[1]+(q[1]-c[1])*.3;
    var s=spread?[ix,iy]:q,e=spread?q:[ix,iy];
    return{x:s[0],y:s[1],dx:e[0]-s[0],dy:e[1]-s[1]}})};
  var sw=function(n,dir){
    var g=n>2?12:16,gc=n>2?15:18;
    if(dir==='up')return mv(row(n,50,68,g),0,-36);
    if(dir==='down')return mv(row(n,50,32,g),0,36);
    if(dir==='left')return mv(col(n,68,50,gc),-36,0);
    return mv(col(n,32,50,gc),36,0);
  };
  var thumb=[[26,72],[50,28],[64,34],[76,46]];
  var ON='On by default',OFF='Off by default',SET='Choose in settings';

  /* ---------- trackpad gestures ---------- */
  var G=[
   {id:'click',sec:'point',t:'Click',f:[1],fl:'1 finger',tag:ON,a:'press',fingers:[{x:50,y:52,dx:0,dy:0}],
    d:'Press down anywhere on the trackpad. You feel a click, but nothing moves. Click twice quickly to double-click.',path:'Trackpad › Point & Click'},
   {id:'tap',sec:'point',t:'Tap to click',f:[1],fl:'1 finger',tag:OFF,a:'tap',fingers:[{x:50,y:52,dx:0,dy:0}],
    d:'Tap lightly with one finger instead of pressing down. Two quick taps double-click.',path:'Trackpad › Point & Click'},
   {id:'secondary',sec:'point',t:'Secondary click',f:[2],fl:'2 fingers',tag:ON,a:'press',fingers:mv(row(2,50,52,16),0,0),
    d:'Right-click. Click with two fingers to open a shortcut menu. You can also click a bottom corner, or hold Control and click.',path:'Trackpad › Point & Click'},
   {id:'lookup',sec:'point',t:'Look up & data detectors',f:[3],fl:'3 fingers',tag:SET,a:'tap',fingers:mv(row(3,50,52,13),0,0),
    d:'Tap with three fingers on a word for its definition, or on an address, date or phone number for quick actions. Force Click can do the same job.',path:'Trackpad › Point & Click'},
   {id:'force',sec:'point',t:'Force Click',f:[1],fl:'1 finger',tag:ON,a:'force',fingers:[{x:50,y:52,dx:0,dy:0}],
    d:'Click, then press a little harder. It previews links, looks up words, renames files in Finder and opens Quick Look.',path:'Trackpad › Point & Click'},

   {id:'scroll',sec:'scroll',t:'Scroll',f:[2],fl:'2 fingers',tag:ON,a:'move',fingers:sw(2,'up'),
    d:'Slide two fingers in any direction. With natural scrolling the page follows your fingers. Flick and let go to coast.',path:'Trackpad › Scroll & Zoom'},
   {id:'pinch',sec:'scroll',t:'Pinch to zoom',f:[2],fl:'2 fingers',tag:ON,a:'move',fingers:conv([[30,70],[70,30]],[50,50],true),
    d:'Spread two fingers apart to zoom in. Pinch them together to zoom out. Works in Photos, Maps, Safari and Preview.',path:'Trackpad › Scroll & Zoom'},
   {id:'smart',sec:'scroll',t:'Smart zoom',f:[2],fl:'2 fingers',tag:ON,a:'dtap',fingers:mv(row(2,50,52,16),0,0),
    d:'Double-tap with two fingers to zoom in on a web page or PDF. Double-tap again to zoom back out.',path:'Trackpad › Scroll & Zoom'},
   {id:'rotate',sec:'scroll',t:'Rotate',f:[2],fl:'2 fingers',tag:ON,a:'rot',rot:60,fingers:[{x:37,y:50,dx:0,dy:0},{x:63,y:50,dx:0,dy:0}],
    d:'Twist two fingers around each other to turn a photo, map or shape.',path:'Trackpad › Scroll & Zoom'},
   {id:'zoomscreen',sec:'scroll',t:'Zoom the whole screen',f:[2],fl:'2 fingers + Control',tag:OFF,a:'move',key:'control',fingers:sw(2,'up'),
    d:'Hold Control and scroll with two fingers to magnify everything on screen.',path:'Accessibility › Zoom'},

   {id:'clickdrag',sec:'drag',t:'Click and drag',f:[1],fl:'1 finger',tag:ON,a:'move',ring:1,item:{x:30,y:62,dx:38,dy:-22,w:16,h:22},fingers:[{x:30,y:62,dx:38,dy:-22}],
    d:'Press and hold, then slide to move a file or select text. Lift to drop. You can hold the click with your thumb and slide with another finger.',path:'Always available'},
   {id:'tapdrag',sec:'drag',t:'Tap-drag',f:[1],fl:'1 finger',tag:OFF,a:'tapdrag',item:{x:30,y:62,dx:40,dy:-24,w:16,h:22},fingers:[{x:30,y:62,dx:40,dy:-24}],
    d:'Double-tap, but keep your finger down on the second tap, then slide. Lift to drop.',path:'Accessibility › Pointer Control › Trackpad Options'},
   {id:'draglock',sec:'drag',t:'Drag lock',f:[1],fl:'1 finger',tag:OFF,a:'lock',item:{x:30,y:62,dx:40,dy:-24,w:16,h:22},fingers:[{x:30,y:62,dx:40,dy:-24}],
    d:'Start the same way, then lift your finger. The item stays picked up so you can reposition your hand. Tap once to drop.',path:'Accessibility › Pointer Control › Trackpad Options'},
   {id:'tfdrag',sec:'drag',t:'Three-finger drag',f:[3],fl:'3 fingers',tag:OFF,a:'move',item:{x:34,y:56,dx:36,dy:-22,w:30,h:36},fingers:mv(row(3,34,56,9),36,-22),
    d:'Rest three fingers on a window, file or selection and slide. No clicking needed. Lift to drop.',path:'Accessibility › Pointer Control › Trackpad Options'},

   {id:'refresh',sec:'more',t:'Swipe down to refresh',f:[2],fl:'2 fingers',tag:ON,a:'move',fingers:sw(2,'down'),
    d:'Swipe down with two fingers to refresh, like pull-to-refresh on iPhone. It works in Safari, Mail, News, Podcasts and Calendar.',path:'No setting needed'},
   {id:'pages',sec:'more',t:'Swipe between pages',f:[2],fl:'2 fingers',tag:ON,a:'move',fingers:sw(2,'right'),
    d:'Swipe left or right with two fingers to go back or forward in Safari, Chrome and Photos. Settings let you use three fingers instead.',path:'Trackpad › More Gestures'},
   {id:'notif',sec:'more',t:'Notification Center',f:[2],fl:'2 fingers',tag:ON,a:'move',edge:'right',fingers:mv(col(2,91,50,18),-46,0),
    d:'Start at the right edge and swipe left with two fingers to open Notification Center and widgets.',path:'Trackpad › More Gestures'},
   {id:'mission',sec:'more',t:'Mission Control',f:[3,4],fl:'3 or 4 fingers',tag:SET,a:'move',fingers:sw(3,'up'),
    d:'Swipe up to see every open window and desktop at once.',path:'Trackpad › More Gestures'},
   {id:'expose',sec:'more',t:'App Exposé',f:[3,4],fl:'3 or 4 fingers',tag:SET,a:'move',fingers:sw(3,'down'),
    d:'Swipe down to spread out all the windows of the app you are using.',path:'Trackpad › More Gestures'},
   {id:'spaces',sec:'more',t:'Full-screen apps and desktops',f:[3,4],fl:'3 or 4 fingers',tag:SET,a:'move',fingers:sw(3,'left'),
    d:'Swipe left or right to move between desktops and full-screen apps.',path:'Trackpad › More Gestures'},
   {id:'desktop',sec:'more',t:'Show Desktop',f:[4],fl:'Thumb + 3 fingers',tag:SET,a:'move',fingers:conv(thumb,[52,56],true),
    d:'Spread your thumb and three fingers apart to push every window aside and reveal the desktop. This is the only thumb-and-fingers gesture left in Trackpad settings.',path:'Trackpad › More Gestures'}
  ];

  /* ---------- keyboard and step cards ---------- */
  /* keys: array of groups; a group is an array of key labels; a plain string is a separator word */
  var K=function(sec,id,t,keys,d,kind,path){return{sec:sec,id:id,t:t,keys:keys,d:d,kind:kind||'Shortcut',path:path||''}};
  var C=function(sec,id,t,steps,d,kind){return{sec:sec,id:id,t:t,steps:steps,d:d,kind:kind||'Steps',path:''}};

  var X=[
   /* screenshots */
   K('shots','shotscreen','Capture the whole screen',[['⇧','⌘','3']],'Takes a picture of everything on screen. A thumbnail slides into the corner, then the file lands on your Desktop.'),
   K('shots','shotarea','Capture part of the screen',[['⇧','⌘','4']],'Drag the crosshair over what you want. Hold Space while dragging to move the selection. Press Esc to cancel.'),
   K('shots','shotwindow','Capture one window',[['⇧','⌘','4'],'then',['Space']],'The pointer turns into a camera. Click a window to capture it. Hold Option while you click to leave out the shadow.'),
   K('shots','shottool','Screenshot and recording toolbar',[['⇧','⌘','5']],'Pick the whole screen, a window or a selection, or record the screen. Options sets a timer, a microphone and where files are saved.'),
   K('shots','shotcopy','Copy a screenshot instead of saving it',[['⌃','⇧','⌘','4']],'Add Control to any screenshot shortcut and the picture goes to the clipboard. Paste it into a message or document with ⌘V.'),
   K('shots','recstop','Stop a screen recording',[['⌘','⌃','Esc']],'Start recording from the toolbar. Stop with this shortcut, or click the stop button in the menu bar.'),
   C('shots','markup','Mark up a screenshot',['Click the corner thumbnail','Draw, type or crop'],'Click the thumbnail before it disappears to open the markup tools. Swipe it right to save it at once.','Screenshot'),
   C('shots','shotsave','Change where screenshots go',['⇧⌘5','Options','Save to'],'Choose Desktop, Documents, Clipboard or any folder.','Screenshot'),

   /* find */
   K('find','spotlight','Spotlight search',[['⌘','Space']],'Type to open apps and files, check the weather, define a word or do maths. Try 20% of 85 or 5 miles in km.'),
   K('find','spotapps','Spotlight apps view',[['⌘','Space'],'then',['⌘','1']],'Shows only apps, wherever they are stored on your Mac. Recently used apps appear first until you start typing.'),
   K('find','finderfind','Search in Finder',[['⌘','F']],'Choose This Mac or the current folder, then filter by kind, date or name. Save the search to reuse it as a smart folder.','Finder'),
   K('find','recents','Recent files',[['⇧','⌘','F']],'Lists files you opened or saved lately, from every folder, in one place.','Finder'),
   K('find','appfind','Find in a page or document',[['⌘','F']],'Type to highlight every match. ⌘G jumps to the next one and ⇧⌘G goes back.'),
   K('find','quicklook','Quick Look',[['Space']],'Select a file and press Space to preview it without opening it. Press Space again to close. Works on PDFs, photos, videos and documents.','Finder'),
   K('find','gofolder','Go to a folder',[['⇧','⌘','G']],'Type a path such as ~/Library to jump straight there.','Finder'),
   K('find','hidden','Show hidden files',[['⇧','⌘','.']],'Press it in Finder to show or hide files that start with a dot.','Finder'),
   K('find','pathbar','Show the path bar',[['⌥','⌘','P']],'Adds the full folder path along the bottom of every Finder window.','Finder'),
   K('find','downloads','Open Downloads',[['⌥','⌘','L']],'Jumps to your Downloads folder in Finder.','Finder'),
   K('find','lookupword','Look up a word',[['⌃','⌘','D']],'Hold the pointer over a word and press this for its definition.'),

   /* essentials */
   K('keys','copy','Copy',[['⌘','C']],'Copies the selected text, file or image.'),
   K('keys','cut','Cut',[['⌘','X']],'Removes the selection and keeps it ready to paste.'),
   K('keys','paste','Paste',[['⌘','V']],'Puts what you copied at the cursor.'),
   K('keys','pastematch','Paste and match style',[['⌥','⇧','⌘','V']],'Pastes text without bringing along the fonts and colors from where you copied it.'),
   K('keys','undo','Undo',[['⌘','Z']],'Reverses your last action. Works for typing, moving files and most edits.'),
   K('keys','redo','Redo',[['⇧','⌘','Z']],'Brings back what you just undid.'),
   K('keys','selectall','Select all',[['⌘','A']],'Selects everything in the window, document or folder.'),
   K('keys','save','Save',[['⌘','S']],'Saves the document you are working on.'),
   K('keys','print','Print',[['⌘','P']],'Opens the print dialog. The PDF menu there can save the page as a PDF.'),
   K('keys','newtab','New tab',[['⌘','T']],'Opens a new tab in Safari, Finder and most browsers.'),
   K('keys','reopentab','Reopen a closed tab',[['⇧','⌘','T']],'Brings back the tab you just closed by mistake.'),
   K('keys','closewin','Close the window',[['⌘','W']],'Closes the front window or tab. The app keeps running.'),
   K('keys','quit','Quit the app',[['⌘','Q']],'Quits the app completely.'),
   K('keys','settingsk','Open an app’s settings',[['⌘',',']],'Opens settings for whichever app is in front.'),
   K('keys','lock','Lock the screen',[['⌃','⌘','Q']],'Locks your Mac right away. Touch ID or your password unlocks it.'),

   /* files */
   K('files','rename','Rename a file',[['Return']],'Select the file, press Return, type the new name, then press Return again.','Finder'),
   K('files','trash','Move to Trash',[['⌘','Delete']],'Sends the selected files to the Trash. Nothing is gone until you empty it.','Finder'),
   K('files','emptytrash','Empty the Trash',[['⇧','⌘','Delete']],'Deletes everything in the Trash for good.','Finder'),
   C('files','putback','Restore from the Trash',['Open Trash','Right-click the file','Put Back'],'Sends the file back to the folder it came from.','Finder'),
   K('files','newfolder','New folder',[['⇧','⌘','N']],'Creates a folder in the current Finder window.','Finder'),
   K('files','duplicate','Duplicate a file',[['⌘','D']],'Makes a copy next to the original.','Finder'),
   K('files','getinfo','Get Info',[['⌘','I']],'Shows size, kind, location and permissions for the selected file.','Finder'),
   K('files','movepaste','Move instead of copy',[['⌘','C'],'then',['⌥','⌘','V']],'Copy a file, open the destination, then use this to move it there instead of making a duplicate.','Finder'),
   K('files','optdrag','Copy by dragging',[['⌥']],'Hold Option while you drag a file to another folder. It copies instead of moving.','Finder'),
   C('files','copypath','Copy a file’s path',['Right-click the file','Hold ⌥','Copy as Pathname'],'Handy when an app or website asks for the exact location.','Finder'),
   K('files','views','Change the Finder view',[['⌘','1'],'to',['⌘','4']],'1 is icons, 2 is a list, 3 is columns and 4 is a gallery with big previews.','Finder'),
   C('files','compress','Make a zip file',['Right-click the file','Compress'],'Creates a smaller .zip next to the original. Double-click a zip to open it.','Finder'),
   K('files','airdrop','AirDrop',[['⇧','⌘','R']],'Opens AirDrop in Finder to send files to nearby iPhones, iPads and Macs.','Finder'),
   K('files','downloadsf','Jump to common folders',[['⇧','⌘','D'],'or',['⇧','⌘','H']],'⇧⌘D opens the Desktop and ⇧⌘H opens your home folder. ⇧⌘O opens Documents and ⇧⌘A opens Applications.','Finder'),

   /* windows and apps */
   K('windows','switchapp','Switch apps',[['⌘','Tab']],'Hold ⌘ and tap Tab to cycle through open apps. Press Q while an app is highlighted to quit it.'),
   K('windows','switchwin','Switch windows in one app',[['⌘','`']],'Moves between the open windows of the app you are in.'),
   K('windows','minimize','Minimize a window',[['⌘','M']],'Tucks the window into the Dock.'),
   K('windows','hide','Hide an app',[['⌘','H']],'Hides the app and its windows. ⌥⌘H hides every other app.'),
   K('windows','fullscreen','Full screen',[['⌃','⌘','F']],'Fills the screen with the window. Press again to leave.'),
   K('windows','tile','Tile windows side by side',[['fn','⌃','←'],'or',['fn','⌃','→']],'Snaps the window to the left or right half. Dragging a window to the edge of the screen does the same.'),
   K('windows','missionk','Mission Control',[['⌃','↑']],'Shows every open window and desktop. Same as the three-finger swipe up.'),
   K('windows','spacesk','Move between desktops',[['⌃','←'],'or',['⌃','→']],'Switches to the desktop on the left or right.'),
   K('windows','forcequit','Force quit a stuck app',[['⌥','⌘','Esc']],'Pick the app that is not responding and choose Force Quit.'),
   K('windows','hidedock','Hide or show the Dock',[['⌥','⌘','D']],'Gives you the whole screen until you press it again.'),
   K('windows','quicknote','Quick Note',[['fn','Q']],'Opens a floating note from anywhere. Hold the Globe or fn key and press Q.'),
   C('windows','hotcorners','Hot Corners',['System Settings','Desktop & Dock','Hot Corners'],'Make a screen corner open Mission Control, Quick Note, the desktop or the screen saver when you push the pointer into it.','Settings'),
   C('windows','dockkeep','Keep an app in the Dock',['Right-click the Dock icon','Options','Keep in Dock'],'Drag icons left or right to reorder. Drag one up and off the Dock to remove it.','Dock'),
   C('windows','controlcenter','Control Center',['Menu bar','Control Center icon'],'Wi-Fi, Bluetooth, AirDrop, Focus, brightness and sound in one panel. Drag any control into the menu bar to keep it there.','Menu bar'),

   /* typing */
   K('typing','emoji','Emoji and symbols',[['⌃','⌘','Space']],'Opens the emoji and symbol picker wherever you can type.'),
   K('typing','accents','Type an accented letter',[['E'],'hold'],'Hold a letter such as e and pick the accent from the pop-up, by clicking it or pressing its number.'),
   K('typing','linestart','Jump to the start or end of a line',[['⌘','←'],'or',['⌘','→']],'Moves the cursor to the beginning or end of the line.'),
   K('typing','wordjump','Move one word at a time',[['⌥','←'],'or',['⌥','→']],'Add Shift to select the words as you go.'),
   K('typing','doctop','Jump to the top or bottom',[['⌘','↑'],'or',['⌘','↓']],'Moves to the very start or end of the document.'),
   K('typing','delword','Delete a whole word',[['⌥','Delete']],'Removes the word before the cursor. Add ⌘ to delete back to the start of the line.'),
   K('typing','style','Bold, italic, underline',[['⌘','B'],',',['⌘','I'],',',['⌘','U']],'Works in Pages, Mail, Notes and most apps that format text.'),
   C('typing','dictation','Dictate instead of typing',['System Settings','Keyboard','Dictation'],'Turn it on, then use the dictation key in the function row to start speaking.','Settings'),
   C('typing','replace','Text shortcuts',['System Settings','Keyboard','Text Replacements'],'Type omw and have it become On my way!, or set up your email address and phone number the same way.','Settings'),
   C('typing','livetext','Copy text from a picture',['Open the image in Preview or Photos','Drag over the text'],'Live Text lets you select, copy and look up words inside photos and screenshots.','Tip'),

   /* everyday */
   C('system','wifi','Connect to Wi-Fi',['Menu bar','Wi-Fi icon','Pick a network'],'Or open System Settings › Wi-Fi. Your Mac remembers networks you have joined.','Settings'),
   C('system','bluetooth','Connect Bluetooth devices',['System Settings','Bluetooth','Connect'],'Put the device in pairing mode first. Headphones, mice and keyboards all use this panel.','Settings'),
   K('system','bright','Brightness and volume',[['F1'],'or',['F2']],'F1 dims and F2 brightens the screen. F10 mutes, and F11 and F12 change the volume. Hold fn to use them as ordinary function keys.','Keys'),
   C('system','update','Update macOS',['System Settings','General','Software Update'],'Install updates when you are plugged in. Your files stay where they are.','Settings'),
   C('system','backup','Back up with Time Machine',['System Settings','General','Time Machine'],'Plug in an external drive and add it as a backup disk. Backups then run automatically.','Settings'),
   C('system','touchid','Set up Touch ID',['System Settings','Touch ID & Password','Add Fingerprint'],'Unlocks your Mac and approves purchases and passwords with a touch.','Settings'),
   C('system','battery','Battery and Low Power Mode',['System Settings','Battery'],'See what is using power and turn on Low Power Mode to stretch the charge.','Settings'),
   C('system','storage','Check free space',['System Settings','General','Storage'],'Shows what is using your disk and offers ways to clear space.','Settings'),
   C('system','findmy','Turn on Find My Mac',['System Settings','Your name','iCloud','Find My Mac'],'Lets you locate, lock or erase a lost Mac from another device.','Settings'),
   C('system','install','Install an app',['App Store','or open the .dmg','Drag to Applications'],'Apps from the App Store install themselves. For downloaded apps, drag the icon into the Applications folder.','Apps'),
   C('system','uninstall','Remove an app',['Finder','Applications','Drag to Trash'],'Then empty the Trash.','Apps'),
   C('system','pdfsign','Sign a PDF',['Open in Preview','Markup toolbar','Sign'],'Sign with your trackpad or by holding your signature up to the camera.','Tip'),
   C('system','pdfsave','Save anything as a PDF',['⌘P','PDF menu','Save as PDF'],'Works from Safari, Pages, Mail and nearly every app that can print.','Tip'),
   C('system','handoff','Copy on iPhone, paste on Mac',['Copy on your iPhone','Paste with ⌘V'],'Needs the same Apple Account on both, with Wi-Fi and Bluetooth on.','Tip'),
   C('system','frozen','If the Mac freezes',['Hold the Touch ID button','Wait for the screen to go dark','Press it again'],'Try Force Quit (⌥⌘Esc) first. Use this only when nothing responds.','Tip')
  ];


  var SECS=[
   {id:'point',eye:'Trackpad',h:'Point &amp; Click',sub:'Clicking, right-clicking and looking things up. Filter the trackpad gestures by finger count:'},
   {id:'scroll',eye:'Trackpad',h:'Scroll &amp; Zoom',sub:'Two fingers cover most of what you do on a page.'},
   {id:'drag',eye:'Trackpad',h:'Dragging',sub:'Four ways to pick something up and put it down. Three of them are off until you turn them on.',band:true},
   {id:'more',eye:'Trackpad',h:'More Gestures',sub:'Swipes that move between pages, desktops and windows. Three or four fingers is your choice in settings.'},
   {id:'settings',eye:'Trackpad',h:'Trackpad settings',sub:'Open System Settings, then Trackpad. Each tab has a short video for every option.',tips:true},
   {id:'shots',eye:'Capture',h:'Screenshots &amp; recording',sub:'Pictures and video of your screen. Everything saves to the Desktop unless you change it.'},
   {id:'find',eye:'Search',h:'Find things',sub:'Open apps, find files and search inside pages.'},
   {id:'keys',eye:'Keyboard',h:'Shortcuts everyone needs',sub:'Fifteen combinations that save the most time. ⌘ is Command, ⌥ is Option, ⌃ is Control and ⇧ is Shift.'},
   {id:'typing',eye:'Text',h:'Typing &amp; editing',sub:'Move around text faster and type things your keyboard does not show.'},
   {id:'files',eye:'Finder',h:'Files &amp; folders',sub:'Move, rename, copy and share files without hunting through menus.'},
   {id:'windows',eye:'Desktop',h:'Windows &amp; apps',sub:'Switch, tile, hide and force quit. Also the Dock and Control Center.'},
   {id:'system',eye:'Setup',h:'Everyday setup',sub:'The settings and fixes you reach for in the first weeks.'}
  ];
  var PAGES=[
   {key:'home',file:'index.html',nav:'Home',name:'Home'},
   {key:'trackpad',file:'trackpad.html',nav:'Trackpad',name:'Trackpad',blurb:'Click, scroll, zoom, drag and every swipe. Each gesture has an animated demo.',secs:['point','scroll','drag','more','settings']},
   {key:'screenshots',file:'screenshots.html',nav:'Screenshots &amp; Search',name:'Screenshots &amp; Search',blurb:'Capture your screen, then find any app, file or word on your Mac.',secs:['shots','find']},
   {key:'shortcuts',file:'shortcuts.html',nav:'Shortcuts',name:'Shortcuts &amp; Typing',blurb:'The key combinations worth learning first, and faster ways to edit text.',secs:['keys','typing']},
   {key:'files',file:'files.html',nav:'Files &amp; Windows',name:'Files &amp; Windows',blurb:'Manage files in Finder and keep your windows, desktops and Dock under control.',secs:['files','windows']},
   {key:'setup',file:'setup.html',nav:'Setup',name:'Everyday Setup',blurb:'Wi-Fi, backups, updates, security and what to do when something goes wrong.',secs:['system']}
  ];
  var TIPS=[
   {id:'tap',t:'Tap to click',d:'Tap lightly instead of pressing down. It is off by default.',p:'Trackpad › Point & Click'},
   {id:'natural',t:'Natural scrolling',d:'On by default, so the page follows your fingers like a phone. Switch it off for the reverse direction.',p:'Trackpad › Scroll & Zoom'},
   {id:'secondary',t:'Secondary click',d:'Choose a two-finger click, or click the bottom-right or bottom-left corner.',p:'Trackpad › Point & Click'},
   {id:'pressure',t:'Click pressure and Quiet Click',d:'Pick Light, Medium or Firm. Quiet Click silences the click sound.',p:'Trackpad › Point & Click'},
   {id:'speed',t:'Tracking speed',d:'Slide to control how far the pointer travels for each swipe of your finger.',p:'Trackpad › Point & Click'},
   {id:'tfd',t:'Three-finger drag',d:'Turn on Use trackpad for dragging, then choose Three Finger Drag. This also controls tap-drag and drag lock.',p:'Accessibility › Pointer Control › Trackpad Options'},
   {id:'fingers',t:'Three or four fingers',d:'Choose which finger count triggers Mission Control, App Exposé and full-screen app swipes.',p:'Trackpad › More Gestures'},
   {id:'zoom',t:'Zoom the screen',d:'Turn on the scroll gesture with a modifier key to magnify the display.',p:'Accessibility › Zoom'}
  ];
  return {G:G,X:X,SECS:SECS,PAGES:PAGES,TIPS:TIPS};
})();
