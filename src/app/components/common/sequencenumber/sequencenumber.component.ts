import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sequencenumber',
  templateUrl: './sequencenumber.component.html',
  styleUrls: ['./sequencenumber.component.css']
})
export class SequencenumberComponent implements OnInit {
  @Input()
  label: string = "Sequence No";
  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  start: number = 0;
  @Input()
  end: number = 100;
  @Input()
  value = null;

  numbers = [];
  val = {};

  constructor() { }

  ngOnInit(): void {
    for (var i = this.start; i <= this.end; i++) {
      this.val = { value: i };
      this.numbers.push(this.val);
    }
  }

}
