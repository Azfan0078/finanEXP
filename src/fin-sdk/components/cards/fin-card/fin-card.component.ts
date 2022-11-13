import { Component, Input } from '@angular/core';

@Component({
  selector: 'fin-card',
  templateUrl: './fin-card.component.html',
  styleUrls: ['./fin-card.component.css']
})
export class FinCardComponent {
  @Input() title!:string
  @Input() subtitle!:string
  @Input() content!: unknown
  @Input() icon!:string
  @Input() iconColor!:string;
  @Input() contentColor!:string;
}
