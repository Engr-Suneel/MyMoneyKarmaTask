import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { IDuration } from 'src/app/core/interfaces/duration';
import { IParagraph } from 'src/app/core/interfaces/paragraph';
import { Utils } from 'src/app/helpers/utils';

@Component({
  selector: 'app-typing-test',
  templateUrl: './typing-test.component.html',
  styleUrls: ['./typing-test.component.css']
})
export class TypingTestComponent implements OnInit, OnDestroy {

  typingTestForm: FormGroup;
  durationControl: FormControl;
  customDurationControl: FormControl;
  paragraphControl: FormControl;
  submitted: boolean = false;
  isCustomDuration: boolean = false;

  durationList: IDuration[] = [];
  paragraphList: IParagraph[] = [];

  isTestStarted: boolean = false;
  isTestStoped: boolean = false;

  countDown: Subscription = new Subscription();
  counter: number = 0;
  total: number = 0;
  progress: number = 0;
  progressColor: string = 'bg-primary';
  selectedParagraph: IParagraph = null!;

  userInput: string = "";
  totalActaulWords: number = 0;
  totalTypedWords: number = 0;
  totalCorrectWords: number = 0;
  totalIncorrectWords: number = 0;
  score: number = 0;

  constructor(
    private fb: FormBuilder
  ) {

    this.durationControl = new FormControl('', [Validators.required]);
    this.customDurationControl = new FormControl('', []);
    this.paragraphControl = new FormControl('', [Validators.required]);

    this.typingTestForm = this.fb.group({
      durationControl: this.durationControl,
      customDurationControl: this.customDurationControl,
      paragraphControl: this.paragraphControl
    });
  }

  ngOnInit(): void {
    this.durationList = Utils.getDurationList();
    this.paragraphList = Utils.getParagraphList();
  }

  get f() {
    return this.typingTestForm.controls;
  }

  onDurationChange() {
    let duration: number = this.durationControl.value;
    if (duration == -1) {
      this.isCustomDuration = true;
      this.customDurationControl.setValidators([Validators.required]);
      this.f.customDurationControl.setValidators([Validators.required]);
    } else {
      this.isCustomDuration = false;
      this.customDurationControl.clearValidators();
      this.f.customDurationControl.clearValidators();
    }

    this.typingTestForm.updateValueAndValidity();
  }

  onPaste(event: any) {
    event.preventDefault();
  }

  ngSubmit() {
    this.submitted = true;
    if (this.typingTestForm.invalid) {
      return;
    }

    let data = this.typingTestForm.value;
    if (!data) {
      return;
    }

    this.counter = data.durationControl * 60;
    if (data.durationControl == -1) {
      this.counter = data.customDurationControl * 60;
    }

    let paragraph = this.paragraphList.find(o => o.id == data.paragraphControl);
    if (!paragraph) {
      return;
    }

    this.selectedParagraph = paragraph;

    this.startTest();
  }

  startTest() {
    this.isTestStarted = true;
    this.progress = 100;
    this.total = this.counter;

    this.countDown = timer(0, 1000).subscribe(() => {
      if (!this.isTestStoped) {
        --this.counter;
        this.progress = (this.counter / this.total) * 100;
        if (this.progress > 0 && this.progress < 20) {
          this.progressColor = 'bg-danger';
        } else if (this.progress > 20 && this.progress < 40) {
          this.progressColor = 'bg-warning';
        } else if (this.progress > 40 && this.progress < 60) {
          this.progressColor = 'bg-info';
        } else if (this.progress > 60 && this.progress < 80) {
          this.progressColor = 'bg-success';
        } else if (this.progress > 80 && this.progress <= 100) {
          this.progressColor = 'bg-primary';
        }

        if (this.counter == 0) {
          this.stopTest();
        }
      }
    });
  }

  resetTest() {
    this.isTestStoped = false;
    this.isTestStarted = false;
    this.selectedParagraph = null!
    this.userInput = "";
    this.submitted = false;
    this.f.durationControl.setValue("");
    this.f.customDurationControl.setValue("");
    this.f.paragraphControl.setValue("");
    this.isCustomDuration = false;
    this.customDurationControl.clearValidators();
    this.f.customDurationControl.clearValidators();
    this.typingTestForm.reset();
    this.typingTestForm.updateValueAndValidity();
  }

  stopTest() {
    this.isTestStoped = true;

    this.calculateScore();
  }

  calculateScore() {
    let acutalList = this.selectedParagraph.paragraph.split(" ");
    this.totalActaulWords = acutalList.length;

    if (!this.userInput) {
      return;
    }

    let typedWordsList = this.userInput.trim().split(" ");
    this.totalTypedWords = typedWordsList.length;

    for (let i = 0; i < typedWordsList.length; i++) {
      if (acutalList[i] && typedWordsList[i]) {
        if (acutalList[i].toLocaleLowerCase() == typedWordsList[i].toLocaleLowerCase()) {
          this.totalCorrectWords += 1;
        } else {
          this.totalIncorrectWords += 1;
        }
      }
    }

    let exp = ((this.totalCorrectWords - this.totalIncorrectWords) / this.totalActaulWords) * 100;
    this.score = Math.round((exp + Number.EPSILON) * 100) / 100
  }

  ngOnDestroy() {
    this.countDown.unsubscribe();
  }
}
