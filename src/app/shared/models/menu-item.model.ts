export class MenuItem {
  title: string;
  routerLink: string;
  children: MenuItem[] = [];
  visible: boolean = true;

  public hasChildren(): boolean {
    return this.children.length > 0;
  }
}