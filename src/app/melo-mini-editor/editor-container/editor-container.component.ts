import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorConfig, ToolbarConfig } from '../editor-config-interface';
import { nanoid } from 'nanoid';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-editor-container',
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.less', '../theme.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorContainerComponent),
      multi: true,
    },
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContainerComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy, AfterViewChecked {
  @Input() editorConfig: EditorConfig;
  @Output() comment = new EventEmitter<string>();
  @Output() sendSavedFiles = new EventEmitter<any>();//coming from menu to container from container to ap
  imageToBeShown:any
  filesFromChild:any
  html: string;
  innerText: string;
  lastChar: string;
  sel: any;
  startOffset: number;
  endOffset: number;
  id: string;
  format: boolean;
  node: any;
  tribute: string;
  flag: number;
  placeholder: string;
  mentionConfig: any;
  mentionid: number | string;
  mentionedNames: { id: number; name: string }[];
  mentionedDates: string[];
  toolbarPlacement: 'top' | 'bottom';
  oldRange: any;
  savedLinks:any=[]
  showResizeDiv:boolean=false
  toolbarConfig: ToolbarConfig;
  fontColor: string;
  backgroundColor: string;
  ResizableNumber:number=0
  ResizeClicked:boolean=false
  PrevIousImage:number
  clicked = false;
  focused:boolean=false
  blured:boolean=true
  dragEvent:boolean=true
  imageEventeId:any
   original_width:any = 0;
   original_height:any = 0;
   original_x:any = 0;
   original_y:any = 0;
   original_mouse_x:any = 0;
   original_mouse_y:any = 0;
   minimum_size:any=0

  constructor(private zone: NgZone, private ref: ChangeDetectorRef) {
    this.fontColor = 'black';
    this.backgroundColor = 'white';
    this.toolbarPlacement = 'bottom';
    this.placeholder = '';
    this.id = nanoid();
    this.resetToolbar();
   
  }

 
  /**
  * @param event - Event which stores the files that are emitted from the file popup
  */
  saveFiles(event: any): void {
    this.editorConfig.buttonName = 'Upload';
    this.sendSavedFiles.emit(event);
  }

//show image in ediotr
  saveImg($event:any)
  {
    console.log("image save")
    this.imageToBeShown=$event
    // console.log("Image from menu to container",this.imageToBeShown)

    const id = (() => {
      // Math.random should be unique because of its seeding algorithm.
      // Convert it to base 36 (numbers + letters), and grab the first 9 characters
      // after the decimal.
      return '_' + Math.random().toString(36).substr(2, 9);
    })();
    console.log('ID', id);
    const ResizableDiv=document.createElement('div')//outer most div 
    ResizableDiv.setAttribute('class','image-container ');
    ResizableDiv.setAttribute('tabindex','0');
    ResizableDiv.setAttribute('id', id);
    ResizableDiv.setAttribute('contenteditable', 'false');

    
    const ResizerDiv = document.createElement('div');
    ResizerDiv.setAttribute('class','ResizerDiv');

   
    const ResizerLeftTop=document.createElement('div');
    ResizerLeftTop.setAttribute('class','resize-pointer top-left');
    ResizerLeftTop.setAttribute('draggable','true')
    ResizerLeftTop.setAttribute('id','LT'+id);

    const ResizerRightTop=document.createElement('div')
    ResizerRightTop.setAttribute('class','resize-pointer top-right')
    ResizerRightTop.setAttribute('draggable','true')
    ResizerRightTop.setAttribute('id', 'RT'+id);

    const ResizerLeftBottom=document.createElement('div')
    ResizerLeftBottom.setAttribute('class','resize-pointer bottom-left')
    ResizerLeftBottom.setAttribute('class','resize-pointer bottom-left')
    ResizerLeftBottom.setAttribute('draggable','true')
    ResizerLeftBottom.setAttribute('id', 'LB' + id);
    
    const ResizerRightBottom=document.createElement('div')
    ResizerRightBottom.setAttribute('class','resize-pointer bottom-right')
    ResizerRightBottom.setAttribute('draggable','true')
    ResizerRightBottom.setAttribute('id', 'RB' + id);
    //this is img tag to show image in the resizer div
    const imgTag= document.createElement('img')
    imgTag.setAttribute('class',"EdiotorImage")
    // imgTag.setAttribute('id','editableImg')
    // imgTag.setAttribute('style','resize: both')
    // imgTag.setAttribute('style','overflow:auto')
    imgTag.setAttribute('style','cursor:pointer')
    // imgTag.style.width=200+"px"
    // imgTag.style.height=200+"px"
    imgTag.setAttribute('src',this.imageToBeShown[(this.imageToBeShown.length-1)].imgUrl)

    ResizerDiv.appendChild(ResizerLeftBottom);
    ResizerDiv.appendChild(ResizerRightBottom);
    ResizerDiv.appendChild(ResizerLeftTop);
    ResizerDiv.appendChild(ResizerRightTop);
    ResizerDiv.appendChild(imgTag);

    ResizableDiv.appendChild(ResizerDiv);

    ResizableDiv.addEventListener('blur',(event: any)=>{
      console.log('BLUR', event.target.id);
    });

    ResizableDiv.addEventListener('focus',(event: any)=>{
      console.log('FOCUS', event.target.id);

    });

    document.getElementsByClassName('editable-block')[0].appendChild(ResizableDiv);
    return;
   

    console.log("image",imgTag)
    this.ResizableNumber=this.ResizableNumber+1

    const element1 = document.querySelector('.EdiotorImage')




  }

  imageResize(event)
  {
    
  }
  
  
  

  saveLinkndShowInEditor($event:any)
  {
    console.log("event",$event)
    const obj={
              linkUrl:$event.linkUrl,
              linkTitle:$event.linkTitle,
              linkText:$event.linkText
         }
          this.savedLinks.push(obj)
        console.log("Links in container",this.savedLinks[this.savedLinks.length-1])
        const anchonrTag=document.createElement('a')
        anchonrTag.innerHTML=this.savedLinks[this.savedLinks.length-1].linkText
        anchonrTag.setAttribute('href',this.savedLinks[this.savedLinks.length-1].linkUrl)
        anchonrTag.setAttribute('title',this.savedLinks[this.savedLinks.length-1].linkTitle)
        console.log("anchor tag",anchonrTag)
        document.getElementsByClassName('editable-block')[0].appendChild(anchonrTag)
  }
  /**
  * @param event - Event which stores the image emitted from the image popup
  */
  saveImage(event:any): void{

      //generate random id  
      const id = (() => {
        return '_' + Math.random().toString(36).substr(2, 9);
      })();

       const imgContainer=document.createElement('div')
       imgContainer.setAttribute('contenteditable','false')
       imgContainer.setAttribute('class','image-container ')
       imgContainer.setAttribute('id','image-container'+id);
       imgContainer.setAttribute('width','200px');
       imgContainer.setAttribute('height','400px');
       imgContainer.setAttribute('tabindex','0');
       imgContainer.setAttribute('style','cursor: pointer;');

       const imgTag = document.createElement('img');
       imgTag.setAttribute('src', event.url);
       imgTag.setAttribute('id','contentimage'+id);
       imgTag.setAttribute('width','100%');
       imgTag.setAttribute('height','auto');
       imgContainer.appendChild(imgTag);


      //image focus
      imgContainer.addEventListener('focus',(event: any)=>{
          this.focused=true
          console.log("FOCUSED VALUE",this.focused)
          console.log(event.target.children);
          // document.getElementById('resizerDiv').style.display = 'inline-block';

          document.getElementById('bottom-right').classList.add('active');
          document.getElementById('bottom-left').classList.add('active');
          document.getElementById('top-right').classList.add('active');
          document.getElementById('top-left').classList.add('active');
          document.getElementById('right').classList.add('active');
          document.getElementById('bottom').classList.add('active');
          document.getElementById('left').classList.add('active');
          document.getElementById('top').classList.add('active');
             
          const imageRatio = event.target.getBoundingClientRect();

          // const minimum_size = 20;
          // let original_width = 0;
          // let original_height = 0;
          // let original_x = 0;
          // let original_y = 0;
          // let original_mouse_x = 0;
          // let original_mouse_y = 0;

          document.getElementById('resizerDiv').style.position="fixed";
          document.getElementById('resizerDiv').style.display='block'
          document.getElementById('resizerDiv').style.left=imageRatio.left+"px";
          document.getElementById('resizerDiv').style.top=imageRatio.top+"px";
          document.getElementById('resizerDiv').style.width=imageRatio.width+"px";
          document.getElementById('resizerDiv').style.height=imageRatio.height+"px";

        const imgId=event.target.id 
        console.log("EVENT ON FOCUS",event.target.id)
        this.imageEventeId=imgId
        console.log("IMAGE  ID ON FOCUS",this.imageEventeId)   
          //change width from top-right
      document.getElementById('top-right').addEventListener('mousedown',(e)=>
      {
        console.log("IMAGE TAG ID",imgId)
        this.dragEvent=true
        e.preventDefault()
        this.original_width = parseFloat(getComputedStyle( document.getElementById(imgId), null).getPropertyValue('width').replace('px', ''));
        this.original_height = parseFloat(getComputedStyle( document.getElementById(imgId), null).getPropertyValue('height').replace('px', ''));
        this.original_x =  document.getElementById(imgId).getBoundingClientRect().left;
        this.original_y =  document.getElementById(imgId).getBoundingClientRect().top;
        this.original_mouse_x = e.pageX;
        this.original_mouse_y = e.pageY;
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)

          function resize(e)
          {
            console.log("TOP RIGHT DRAG",e.target)
            const width = this.original_width + (e.pageX - this.original_mouse_x)
            const height = this.original_height - (e.pageY - this.original_mouse_y)
            console.log("IMge ID ON DRAG",imgId)
            document.getElementById(imgId).style.width = width + 'px'
            document.getElementById(imgId).style.height = height + 'px'
              document.getElementById(imgId).style.top = this.original_y + (e.pageY - this.original_mouse_y) + 'px'
            if (width > this.minimum_size) {
              document.getElementById(imgId).style.width = width + 'px'
            }
            if (height > this.minimum_size) {
              document.getElementById(imgId).style.height = height + 'px'
              document.getElementById(imgId).style.top = this.original_y + (e.pageY - this.original_mouse_y) + 'px'
          }
          }  

          function stopResize() {
            window.removeEventListener('mousemove', resize)
          }
      
      } )

    
    })

      
      //image blur
      imgContainer.addEventListener('blur',(event: any)=>{
          console.log('Blur');
          document.getElementById('bottom-right').classList.remove('active')
          document.getElementById('bottom-left').classList.remove('active')
          document.getElementById('top-right').classList.remove('active')
          document.getElementById('top-left').classList.remove('active')
          document.getElementById('right').classList.remove('active')
          document.getElementById('bottom').classList.remove('active')
          document.getElementById('left').classList.remove('active')
          document.getElementById('top').classList.remove('active')
          if(this.dragEvent===false)
          { 
            document.getElementById('resizerDiv').style.display = 'none';
          }
          
      })

      this.sel.removeAllRanges();
      const range = this.oldRange.cloneRange();
      range.insertNode(imgContainer);
      range.setStartAfter(imgContainer);
      range.collapse();
      this.sel.addRange(range);


      //create image container
    /*  console.log("Image save THIS IS LIFE")
      const imgContainer=document.createElement('div')
      imgContainer.setAttribute('contenteditable','false')
      imgContainer.setAttribute('class','image-container ')
      imgContainer.setAttribute('id','image-container'+id);


      const topHandle=document.createElement('div')
      topHandle.setAttribute('class','resize-pointer top ')
      topHandle.setAttribute('draggable','true')
      topHandle.setAttribute('id','top'+id)

      const leftHandle=document.createElement('div')
      leftHandle.setAttribute('class','resize-pointer left ')
      leftHandle.setAttribute('draggable','true')
      leftHandle.setAttribute('id','left'+id)


      const rightHandle=document.createElement('div')
      rightHandle.setAttribute('class','resize-pointer right ')
      rightHandle.setAttribute('draggable','true')
      rightHandle.setAttribute('id','right'+id)

      const bottomHandle=document.createElement('div')
      bottomHandle.setAttribute('class','resize-pointer bottom ')
      bottomHandle.setAttribute('draggable','true')
      bottomHandle.setAttribute('id','bottom'+id)

      const bottomLeftHandle=document.createElement('div')
      bottomLeftHandle.setAttribute('class','resize-pointer bottom-left  ')
      bottomLeftHandle.setAttribute('draggable','true')
      bottomLeftHandle.setAttribute('id','bottom-left'+id)

      
      const topLeftHandle=document.createElement('div')
      topLeftHandle.setAttribute('class','resize-pointer top-left  ')
      topLeftHandle.setAttribute('draggable','true')
      topLeftHandle.setAttribute('id','top-left'+id)

      
      const bottomRightHandle=document.createElement('div')
      bottomRightHandle.setAttribute('class','resize-pointer bottom-right')
      bottomRightHandle.setAttribute('draggable','true')
      bottomRightHandle.setAttribute('id','bottom-right'+id)

      const topRightHandle=document.createElement('div')
      topRightHandle.setAttribute('class','resize-pointer top-right')
      topRightHandle.setAttribute('draggable','true')
      topRightHandle.setAttribute('id','top-right'+id)

      imgContainer.appendChild(topHandle)
      imgContainer.appendChild(leftHandle)
      imgContainer.appendChild(rightHandle)
      imgContainer.appendChild(bottomHandle)
      imgContainer.appendChild(topLeftHandle)
      imgContainer.appendChild(topRightHandle)
      imgContainer.appendChild(bottomLeftHandle)
      imgContainer.appendChild(bottomRightHandle)

      const spanContainer=document.createElement('span')
      spanContainer.setAttribute('class','image-resize')
      const imgTag = document.createElement('img')
      spanContainer.appendChild(imgTag)
      imgContainer.appendChild(spanContainer)
      imgContainer.setAttribute('tabindex','0')
      imgTag.setAttribute('src', event.url);
      imgTag.setAttribute('id','contentimage')
      imgTag.setAttribute('width','100%')
      imgTag.setAttribute('height','auto')

      this.sel.removeAllRanges();
      const range = this.oldRange.cloneRange();
      range.insertNode(imgContainer);
      range.setStartAfter(imgContainer);
      range.collapse();
      this.sel.addRange(range);

      
      //now show handles on the image to resize

      imgContainer.addEventListener('blur',(event: any)=>{
      
        
        event.target.classList.remove('active')
        event.target.children[0].classList.remove('active');
        event.target.children[1].classList.remove('active');
        event.target.children[2].classList.remove('active');
        event.target.children[3].classList.remove('active');
        event.target.children[4].classList.remove('active');
        event.target.children[5].classList.remove('active');
        event.target.children[6].classList.remove('active');
        event.target.children[7].classList.remove('active');
      });
  
      imgContainer.addEventListener('focus',(event: any)=>{


        event.target.classList.add('active')
        event.target.children[0].classList.add('active');
        event.target.children[1].classList.add('active');
        event.target.children[2].classList.add('active');
        event.target.children[3].classList.add('active');
        event.target.children[4].classList.add('active');
        event.target.children[5].classList.add('active');
        event.target.children[6].classList.add('active');
        event.target.children[7].classList.add('active');
         
        const minimum_size = 20;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;

        event.target.children[7].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          console.log("LEFT",original_width,'TOP',original_height)
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
           window.addEventListener('mouseup', stopResize)
        })

        event.target.children[0].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
          window.addEventListener('mouseup', stopResize)
        })
    
        event.target.children[1].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
          window.addEventListener('mouseup', stopResize)
        })

        event.target.children[2].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
           window.addEventListener('mouseup', stopResize)
        })

        event.target.children[3].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
           window.addEventListener('mouseup', stopResize)
        })

       
        event.target.children[4].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
           window.addEventListener('mouseup', stopResize)
        })
    
        event.target.children[5].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
           window.addEventListener('mouseup', stopResize)
        })
    

        event.target.children[6].addEventListener('mousedown', function(e) {
          e.preventDefault()
          console.log("Mouse down")
          original_width = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('width').replace('px', ''));
          original_height = parseFloat(getComputedStyle(imgTag, null).getPropertyValue('height').replace('px', ''));
          original_x = imgContainer.getBoundingClientRect().left;
          original_y = imgContainer.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', resize)
           window.addEventListener('mouseup', stopResize)
        })
    
    
    
    
    

        function resize(e)
        {
          console.log("Mouse Move")
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y)
          imgContainer.style.width = width + 'px'
          imgContainer.style.height = height + 'px'
          // if (width > minimum_size) {
          //   spanContainer.style.width = width + 'px'
          // }
          // if (height > minimum_size) {
          //   spanContainer.style.height = height + 'px'
          // }
        }
    

        function stopResize() {
          console.log("Remove listener")
          window.removeEventListener('mousemove', resize)
        }
  
  
      });


  */
      
  

  }

  /**
  * @param event - Event which stores the link emitted from the link popup
  */
  saveLink(event:any) : void{
    const anchorTag = document.createElement('a');
    anchorTag.innerHTML = event.linkText;
    anchorTag.setAttribute('href', event.linkUrl);
    anchorTag.setAttribute('title', event.linkTitle);
    anchorTag.setAttribute('target', '_blank');
    anchorTag.setAttribute('rel', 'noopener noreferrer');

    this.sel.removeAllRanges();
    const range = this.oldRange.cloneRange();
    range.insertNode(anchorTag);
    range.setStartAfter(anchorTag);
    range.collapse();
    this.sel.removeAllRanges();
    this.sel.addRange(range);
  }
  
  resetToolbar(): void {
    this.toolbarConfig = {
      bold: false,
      italic: false,
      underline: false,
      strikeThrough: false,
      orderedList: false,
      unorderedList: false,
      superscript: false,
      subscript: false,
      quote: false,
      fontColor: this.fontColor,
      backgroundColor: this.backgroundColor,
    };
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  set htmlVal(html) {
    if (html !== null && html !== undefined && this.html !== html) {
      this.html = html;
      this.onChange(html);
      this.onTouch(html);
    }
  }

  writeValue(value: any): void {
    this.htmlVal = value;
  }

  ngAfterViewChecked(): void {
    // console.log('Change detection triggered!');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnInit(): void {
    this.sel = window.getSelection();
  }

  ngAfterViewInit(): void {
    // document.getElementById('resizerDiv').style.display = 'none';
    document.addEventListener(
      'selectionchange',
      this.selectionChange.bind(this),
      false
    );
    
  }
  immageResize() {
    const imageWidth = document.getElementById('contentimage').offsetWidth;
    const imageHeight = document.getElementById('contentimage').offsetWidth;
    console.log('Hi');
  }

  ngOnDestroy(): void {
    document.removeEventListener(
      'selectionchange',
      this.selectionChange.bind(this),
      false
    );
  }

  selectionChange(event: any): void {
    if (document.activeElement === document.getElementById(this.id)) {
      this.oldRange = this.sel.getRangeAt(0).cloneRange();
      this.setFontAndbackgroundColor();
      this.toolbarConfig = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        underline: document.queryCommandState('underline'),
        orderedList: document.queryCommandState('insertorderedList'),
        unorderedList: document.queryCommandState('insertunorderedList'),
        fontColor: this.fontColor,
        backgroundColor: this.backgroundColor,
        quote: this.checkParent(this.sel.anchorNode, 'blockquote'),
        superscript: this.checkParent(this.sel.anchorNode, 'sup'),
        subscript: this.checkParent(this.sel.anchorNode, 'sub')
      };
    } else {
      this.resetToolbar();
    }
  }

  setFontAndbackgroundColor(): void {
    if(this.sel?.baseNode) {
      const node = this.sel.baseNode;
      if(node?.parentNode?.nodeName === 'SPAN' && node?.parentNode?.attributes[0].name === 'style') {
        let styleAttrib = node?.parentNode?.attributes[0].nodeValue;
        const styleArray: string[] = styleAttrib.split(';');
        for(const style of styleArray) {
           if(style.indexOf('background-color:') > -1) {
            this.backgroundColor = style.substring(style.indexOf(':') + 1).trim();
          } else if(style.indexOf('color:') > -1) {
            this.fontColor = style.substring(style.indexOf(':') + 1).trim();
          } 
        }
      } else {
        this.fontColor = 'black';
        this.backgroundColor = 'white';
      }
    } else {
        this.fontColor = 'black';
        this.backgroundColor = 'white';
    }
  }

  checkParent(elem: any, tagName: string): boolean {
    if (elem) {
      if (elem?.nodeName === 'APP-TEXT-EDITOR') {
        return false;
      } else {
        if (elem.nodeName === tagName.toUpperCase()) {
          return true;
        } else {
          return this.checkParent(elem?.parentNode, tagName);
        }
      }
    } else {
      return false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editorConfig && this.editorConfig) {
      this.placeholder = this.editorConfig?.placeholder ?? 'Please Add Some Text';

      this.mentionConfig = {};
      if (
        Array.isArray(this.editorConfig?.mentionedNames) &&
        this.editorConfig?.mentionedNames.length > 0
      ) {
        this.editorConfig.mentionedNames = this.editorConfig?.mentionedNames.filter(
          (item: { id: number; name: string }) => {
            if (item.id !== 0 && item.name.trim() !== '') {
              return item;
            }
          }
        );

        this.mentionConfig.mentions = [];
        this.mentionConfig.mentions.push({
          items: this.editorConfig.mentionedNames,
          triggerChar: '@',
          mentionSelect: (item) => {
            this.tribute = `@${item.name}`;
            this.mentionid = item.id;
            return this.tribute;
          },
          labelKey: 'name',
          maxItems: 20,
          disableSearch: false,
          dropUp: true,
        });
      }
      if (
        Array.isArray(this.editorConfig?.mentionedDates) &&
        this.editorConfig?.mentionedDates.length > 0
      ) {
        this.editorConfig.mentionedDates = [
          ...new Set(this.editorConfig?.mentionedDates),
        ];
        this.mentionConfig.mentions.push({
          items: this.editorConfig.mentionedDates,
          triggerChar: '#',
          mentionSelect: (item) => {
            this.tribute = `#${item.date}`;
            this.mentionid = item.date;
            return this.tribute;
          },
          labelKey: 'date',
          maxItems: 20,
          disableSearch: false,
          dropUp: true,
        });
      }
    }
  }

  getPrecedingCharacter(container: any): string {
    if (this.sel) {
      const r = this.sel.getRangeAt(0).cloneRange();
      r.setStart(container, 0);
      return r.toString().slice(-1);
    }
    return '';
  }

  checkValidOperation(elem: any): boolean {
    if (elem) {
      if (elem === document.getElementById(this.id)) {
        return true;
      } else {
        return this.checkValidOperation(elem?.parentNode);
      }
    } else {
      return false;
    }
  }

  blur(): void {
    this.oldRange = this.sel.getRangeAt(0).cloneRange(); // to store the range when element is blurred
  }

  focus(): void {
    if (document.getElementById(`${this.id}`)) {
      document.getElementById(`${this.id}`).focus();
    }
  }
   
  /**
  * @param event - This parameter is an event that is occurred whenever we make changes inside the div contenteditable
  */
  setValue(innerText: string): void {
    this.innerText = innerText;

    if (this.innerText === '') {
      document.execCommand('removeFormat', false, ''); // remove previous format once the editor is clear
      this.toolbarConfig.fontColor = 'black';
      this.toolbarConfig.backgroundColor = 'white';
      this.toolbarOperations('textColor', 'black');
      this.toolbarOperations('fillColor', 'white');
    }
    this.lastChar = this.getPrecedingCharacter(
      window.getSelection().anchorNode
    
    ); // gets the last input character

    if (this.format && this.startOffset && this.tribute) {
      this.format = false;
      this.endOffset = this.sel.getRangeAt(0).endOffset;

      const range = document.createRange();
      range.setStart(this.node, this.startOffset - 1);
      range.setEnd(this.node, this.endOffset);
      range.deleteContents(); // deleting previous set contents
    }

    if (this.lastChar === '@' || this.lastChar === '#') {
      this.node = this.sel.anchorNode;
      this.format = true;
      this.flag = this.lastChar === '@' ? 0 : 1;
      this.startOffset = this.sel.getRangeAt(0).startOffset;
    }

    this.writeValue(document.getElementById(`${this.id}`).innerHTML);
  }

  /**
  * This function is called whenever the mention tab is closed
  */
  mentionClosed(): void {
    // insert mentions

    if (this.tribute !== '') {
      const input = document.createElement('input');
      input.setAttribute('value', `${this.tribute}`);
      input.setAttribute('type', 'button');
      input.setAttribute('disabled', 'true');
      input.setAttribute('data-id', `${this.mentionid}`);
      input.setAttribute('mention-data', `${this.flag === 0 ? '@' : '#'}`);
      input.style.border = 'none';
      input.style.borderRadius = '2px';
      input.style.padding = '3px';
      input.style.backgroundColor = '#e7eff6';
      input.style.color = '#4681ef';
      input.style.fontWeight = 'inherit';
      input.style.fontSize = 'inherit';
      const range = this.sel.getRangeAt(0).cloneRange();
      this.sel.removeAllRanges();
      const sp = document.createTextNode(' ');
      range.insertNode(input);
      range.insertNode(sp);
      range.setStartAfter(input);
      this.sel.addRange(range);
      this.tribute = '';
    }
    //  this.valueInput = true;
  }

  /**
  * @param event - This parameter is an event that is occurred whenever we paste things inside the div contenteditable
  */
  onPaste(event: any): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    let pastedHtml = clipboardData.getData('text/html');
    let pastedText = clipboardData.getData('text');
    const regexStyle = /style=".+?"/g; // matching all inline styles
    // const regexComment = /<!--.+?-->/g; // matching all inline styles
    if (pastedHtml === '' && pastedText !== '') {
      const rex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      pastedText = pastedText.replace(rex, (match: any) => {
        return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
      });
      document.execCommand('insertHtml', false, pastedText);
    } else {
      // console.log('HERE', pastedHtml);
      pastedHtml = pastedHtml.replace(regexStyle, (match: any) =>  '');
      const rexa = /href=".*?"/g; // match all a href
      pastedHtml = pastedHtml.replace(rexa, (match: any) => {
        const str = ' target="_blank" rel="noopener noreferrer"';
        return match + str;
      });
      document.execCommand('insertHtml', false, pastedHtml);
    }
  }

  toolbarClicked(event: any): void {
    try {
      const { startContainer } = this.sel.getRangeAt(0);
      if(this.checkValidOperation(startContainer)) {
        
        if (this.oldRange) {

          if(this.oldRange.collapsed) {

            this.sel.removeAllRanges();
            const range = this.oldRange.cloneRange();
            const t = document.createTextNode('');
            range.insertNode(t);
            range.setStartAfter(t);
            range.collapse();
            this.sel.addRange(range);

          }
        } else {
          this.focus();
        }
      } else {
        this.focus();
      }
    } catch(err) {
      this.focus();
    }
    this.toolbarOperations(event?.id, event?.value);
  }

  /**
   * 
   * @param id- represents the toolbar button that was clicked
   * @param value - Value that is passed from the toolbar to editor to perform operations
   */
  toolbarOperations(id: string, value: any): void {
    if (id && id !== 'fillColor' && id !== 'textColor' && id !== 'subscript' && id !== 'superscript' && id !== 'quote') {
      if (!this.toolbarConfig[id]) {
        this.toolbarConfig[id] = true;
      } else {
        this.toolbarConfig[id] = false;
      }
    }
    switch (id) {
      case 'h1': 
      case 'h2': 
      case 'h3': document.execCommand('formatBlock', false, id.toUpperCase());
                 break; 
      case 'para': document.execCommand('formatBlock', false, 'p');
                   break; 
      case 'superscript': this.insertSupTag();
                        break;
      case 'subscript': this.insertSubTag();
                        break;
      case 'bold':
        document.execCommand('bold', false, '');
        break;
      case 'italic':
        document.execCommand('italic', false, '');
        break;
      case 'strikeThrough':
        document.execCommand('strikeThrough', false, '');
        break;
      case 'underline':
        document.execCommand('underline', false, '');
        break;
      case 'orderedList':
        document.execCommand('insertOrderedList', false, '');
        break;
      case 'unorderedList':
        document.execCommand('insertunorderedList', false, '');
        break;
      case 'quote':
        this.insertBlockQuote();
        break;
      case 'increaseIndent':
        document.execCommand('indent', false, '');
        break;
      case 'decreaseIndent':
        document.execCommand('outdent', false, '');
        break;
      case 'left-align':
        document.execCommand('justifyleft', false, '');
        break;
      case 'center-align':
        document.execCommand('justifycenter', false, '');
        break;
      case 'right-align':
        document.execCommand('justifyright', false, '');
        break;
      case 'justify-full':
        document.execCommand('justifyfull', false, '');
        break;
      case 'fillColor':
        document.execCommand('styleWithCSS', false, '');
        document.execCommand('hiliteColor', false, value);
        if(!this.sel.getRangeAt(0).collapsed) {
          this.sel.getRangeAt(0).collapse();
        }
        break;
      case 'textColor':
        document.execCommand('styleWithCSS', false, '');
        document.execCommand('foreColor', false, value);
        if(!this.sel.getRangeAt(0).collapsed) {
          this.sel.getRangeAt(0).collapse();
        }
        break;
      case '@': this.insertTribute('@'); 
                break;
      case '#': this.insertTribute('#'); 
                break;
      case 'submit': this.commentAction();
                     break;
      case 'font-verdana': document.execCommand('fontName', false, 'verdana');
                           break;
      case 'font-arial': document.execCommand('fontName', false, 'arial');
                         break;
      case 'font-georgia': document.execCommand('fontName', false, 'georgia');
                           break;
      case 'font-impact': document.execCommand('fontName', false, 'impact');
                          break;
      case 'font-courier': document.execCommand('fontName', false, 'courier');
                           break;
      case 'font-tahoma': document.execCommand('fontName', false, 'tahoma');
                          break;
    }
  }

  insertBlockQuote(): void {
    if (!this.toolbarConfig.quote) {
      const blockquote = document.createElement('blockquote');
      blockquote.setAttribute('style', 'box-sizing: border-box; padding-left:16px; padding-bottom: 10px; border-left: 2px solid rgb(223, 225, 230); margin: 1.143rem 5px 0px');
      blockquote.innerHTML = '&#8204;';
      const div = document.createElement('div');
      div.appendChild(document.createElement('br'));
      const range =  this.sel.getRangeAt(0);
      range.insertNode(div);
      range.insertNode(blockquote);
      range.setStart(blockquote, 0);
      range.setEnd(blockquote, 0);
      range.collapse();
    } else {
      this.reachTextNode('blockquote');
    }
  }

  insertSupTag(): void {
    if(!this.toolbarConfig.superscript) {
      const sup = document.createElement('sup');
      sup.innerHTML = '&#8204;';
      const range = this.sel.getRangeAt(0);
      range.insertNode(sup);
      range.setStart(sup, 1);
      range.setEnd(sup, 1);
      range.collapse();
    } else {
      this.reachTextNode('sup');
    }
  }

  insertSubTag(): void {
    if(!this.toolbarConfig.subscript) {
      const sub = document.createElement('sub');
      sub.innerHTML = '&#8204;';
      const range = this.sel.getRangeAt(0);
      range.insertNode(sub);
      range.setStart(sub, 1);
      range.setEnd(sub, 1);
      range.collapse();
    } else {
      this.reachTextNode('sub');
    }
  }

  reachTextNode(tagName: string): void {
    const parent = this.getParent(this.sel.anchorNode, tagName);
    const space = document.createElement('text');
    space.innerHTML = '&#8204;';
    if (parent?.nextSibling) {
      this.sel.getRangeAt(0).setStartAfter(parent.nextSibling);
    } else {
      this.sel.getRangeAt(0).setStartAfter(parent);
    }
    this.sel.getRangeAt(0).insertNode(space);
    this.sel.getRangeAt(0).setStartAfter(space);
  }


  /**
   * 
   * @param elem - The element whose parent element we need to find
   * @param tagName - Tag name to check if it is the parent node of elem
   */
  getParent(elem: any, tagName: string): any {
    if (elem) {
      if (elem?.nodeName === 'APP-TEXT-EDITOR') {
        return null;
      } else {
        if (elem.nodeName === tagName.toUpperCase()) {
          return elem;
        } else {
          return this.getParent(elem?.parentNode, tagName);
        }
      }
    } else {
      return null;
    }
  }

  /**
   *  Output event to export comment data and cleanup the editor
   */
  commentAction(): void {
    const event = document.getElementById(`${this.id}`).innerHTML;
    this.comment.emit(event);
    document.getElementById(`${this.id}`).innerHTML = '';
  }

  /**
   * 
   * @param char - Represents the tribute that was clicked from the toolbar i.e @ or #
   */
  insertTribute(char: string): void {
    if (this.sel) {
      if (this.oldRange) {
        const code = char === '@' ? 'Digit2' : 'Digit3';
        const event = new KeyboardEvent('keydown', { key: `${char}`, code: `${code}` });
        this.sel.removeAllRanges();
        this.sel.addRange(this.oldRange);
        document.getElementById(this.id).dispatchEvent(event);
        const a = document.createTextNode(`${char}`);
        this.oldRange.insertNode(a);
        this.oldRange.setStartAfter(a);
        this.setValue(document.getElementById(this.id).innerText);
      } else {
        this.focus();
        this.oldRange = this.sel.getRangeAt(0).cloneRange();
        this.insertTribute(char);
      }
    }
  }


  clickedOnImage() {
    this.clicked = true;
  }
}
