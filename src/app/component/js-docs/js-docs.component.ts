import { Component, ElementRef, HostListener, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-js-docs',
  templateUrl: './js-docs.component.html',
  styleUrls: ['./js-docs.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class JsDocsComponent implements OnInit {

  private toc: HTMLElement;
  private moc: HTMLElement;
  private poc: HTMLElement;
  public tocContent: string;
  public pocContent: string;
  public mocContent: string;
  public pageYoffset: number;
  private baseMocUrl: string = `./assets/md/main/`;
  private basePocUrl: string = `./assets/md/poc/`;
  public breadcrumbs: string;
  private isClick: boolean;

  public get isMoblieDevice(){
    let isMobileDevice = document.body.clientWidth <= 540;
    return isMobileDevice;
  }

  constructor(
    public elerf: ElementRef,
  ) { }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: MouseEvent): void {
    const clickRoot = <HTMLElement[]>[...event?.composedPath()].reverse();
    if(clickRoot.find(node => node.id === 'tocContent')){
      this.toggleTocContent(clickRoot);
    }else if(clickRoot.find(node => node.id === 'pocContent')){
      this.togglePocContent(clickRoot);
    }
  }

  @HostListener('window:scroll', ['$event'])
  private onScroll(event: MouseEvent): void {
    const scrollRoot = <HTMLElement[]>[...event?.composedPath()].reverse();
    if (scrollRoot.find(node => node.nodeName === '#document')) {
      this.pageYoffset = window.pageYOffset;
      if(this.isClick){
        setTimeout(() => {
          this.setScrollHighlightColor();
          this.isClick = false;
        }, 1000);
      }else{
        this.setScrollHighlightColor();
      }
      // console.log('scroll:', [event, window.pageYOffset]);
    }
  }

  public ngOnInit(): void {
    document.body.addEventListener('touchstart',() => { });
    this.tocContent = './assets/md/toc/toc' + '.md';
    this.pocContent = './assets/md/poc/introduction' + '.md';
    this.mocContent = './assets/md/main/introduction' + '.md';
    this.breadcrumbs = 'Js Docs / Introduction';
    setTimeout(() =>{
      this.getParentElements();
    },0);
  }

  private getParentElements(): void{
    this.toc = <HTMLDivElement>this.elerf.nativeElement.querySelector('#tocContent');
    this.moc = <HTMLDivElement>this.elerf.nativeElement.querySelector('#mainContent');
    this.poc = <HTMLDivElement>this.elerf.nativeElement.querySelector('#pocContent');
  }

  private toggleTocContent(clickRoot: HTMLElement[]): void{
    const liElement = clickRoot.find(node => node.nodeName === 'LI');
    const liContent = liElement?.nodeName === 'LI' ? (liElement?.innerText) : '';
    if(liElement?.nodeName === 'LI' && liContent){
      this.mocContent = `${this.baseMocUrl}/${liContent.toLocaleLowerCase()}.md`;
      this.pocContent = `${this.basePocUrl}/${liContent.toLocaleLowerCase()}.md`;
      const tocLis = this.toc?.querySelectorAll('li');
      tocLis?.forEach(li => {
        li.classList.remove('active');
        li.classList.remove('expandIcon');
        li.classList.add('collapseIcon');
      });
      liElement.classList.add('active');
      liElement.classList.add('expandIcon');
      liElement.classList.remove('collapseIcon');
      this.moc?.setAttribute('src', this.mocContent);
      this.poc?.setAttribute('src', this.pocContent);
      this.breadcrumbs = `Js Docs / ${liContent.charAt(0).toLocaleUpperCase() + liContent.slice(1)}`;
      // console.log("toggleTocContent", [clickRoot, liElement, liContent]);
    }
  }

  private togglePocContent(clickRoot: HTMLElement[]): void{
    const liElement = clickRoot.find(node => node.nodeName === 'LI');
    const liContent = liElement?.nodeName === 'LI' ? (liElement?.innerText) : '';
    const pocLis = this.poc?.querySelectorAll('li');
    const mocH2s = this.moc?.querySelectorAll('h2');
    if(liElement?.nodeName === 'LI' && liContent && mocH2s?.length > 0){
      pocLis?.forEach( pocli => {
        pocli.classList.remove('active');
        liElement.classList.add('active');
      });
      mocH2s?.forEach( mocH2 => {
        if(mocH2.innerText === liContent){
          window.scrollTo({ top: mocH2.offsetTop , behavior: 'smooth'});
        }
      });
      this.isClick = true;
    }
    // console.log("togglePocContent", [clickRoot, liElement, liContent, mocH2s]);
  }

  private setScrollHighlightColor(): void{
    if(!this.isClick){
      const mocH2s = this.moc?.querySelectorAll('h2');
      const pocLis = this.poc?.querySelectorAll('li');
      if(mocH2s.length > 0 && pocLis.length > 0){
        mocH2s.forEach( mocH2 => {
          if(this.pageYoffset === 0 || this.pageYoffset < 100){
            pocLis.forEach( pocLi => {
              pocLi.classList.remove('active');
            });
            pocLis[0].classList.add('active');
          }else if(this.pageYoffset + window.innerHeight - mocH2.offsetHeight * 3.5 > mocH2.offsetTop){
            pocLis.forEach( pocLi => {
              pocLi.innerText === mocH2.innerText ? pocLi.classList.add('active') : pocLi.classList.remove('active');
            });
          }
        });
      }
    }
    // console.log("setHighlightColor_mocH2s: ", [this.moc ,mocH2s]);
  }

  public scrollToTop(): void{
    window.scrollTo({ top: 0, behavior: 'smooth' });
    location.hash = '';
  }

}
