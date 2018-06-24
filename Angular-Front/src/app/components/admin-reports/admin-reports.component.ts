import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";
import * as jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";
import 'jspdf-autotable';
import {style} from "@angular/animations";
import {StudentService} from "../../service/student.service";


@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  user:any;
  students:any;
  totalFine=0;
  fines:any;
  books:any;
  message:String;
  searchText = {
    enteredText:"",
    enteredTextStudent:""
  };
  constructor(private authService:AuthService,private router:Router,private bookService:BookService,private studentService:StudentService) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getAdminHome().subscribe(res=>{
        this.user = res.user;

        if(this.user.type=="Student"){
          this.router.navigate(['student-home']);
        }
      });

      // load fine details
      this.bookService.filterBorrowDetails(this.searchText).subscribe(res=>{
        if(res.msg==""){
          this.message="No search results found";
        }
        else{
          this.message="";
          this.fines = res.msg;
          let i;
          for (i = 0; i < this.fines.length; i++) {
            if (this.fines[i].fine!=null){
              this.totalFine = this.totalFine + parseInt(this.fines[i].fine);
            }
          }
        }
      });

      // load borrowed books
      this.bookService.filterBorrowDetails(this.searchText).subscribe(res=>{
        if(res.msg==""){
          this.message="No search results found";
        }
        else{
          this.message="";
        }
        this.books = res.msg;
      });
    }

    this.onKeyStudentSearch("true"); // load the student details
  }

  generateAllFines(){
    this.totalFine=0;

    let columns = [
      {title: "Index/Reg No.", dataKey: "index"},
      {title: "Name", dataKey: "name"},
      {title: "Contact", dataKey: "contact"},
      {title: "ISBN", dataKey: "isbn"},
      {title: "Title", dataKey: "title"},
      {title: "Borrowed Date", dataKey: "bdate"},
      {title: "Overdue Date", dataKey: "odate"},
      {title: "Fine (Rs.)", dataKey: "fine"},
    ];
    let rows = [];

    let i;
    for (i = 0; i < this.fines.length; i++) {
      if (this.fines[i].fine!=null){
        this.totalFine = this.totalFine + parseInt(this.fines[i].fine);
        let fine = {
          "index":this.fines[i].student.index_no,
          "name":this.fines[i].student.name,
          "contact":this.fines[i].student.email,
          "isbn":this.fines[i].isbn,
          "title":this.fines[i].title,
          "bdate":this.fines[i].borrowed_date,
          "odate":this.fines[i].return_date,
          "fine":this.fines[i].fine};
        rows.push(fine);
      }
    }
    rows.push({"index":"TOTAL",
      "name":"",
      "contact":"",
      "isbn":"",
      "title":"",
      "bdate":"",
      "odate":"",
      "fine":"Rs."+this.totalFine});

    html2canvas(document.querySelector("#captureFineTable")).then(function (canvas) {
      const imgData = canvas.toDataURL("image/png");


// Only pt supported (not mm or in)
      let doc = new jsPDF('p', 'pt');
      doc.autoTable(columns, rows, {
        styles: {overflow:"linebreak",fontSize:8,halign:'center'},
        headerStyles: {fillColor:[142,78,156]},
        columnStyles: {
          "index": {columnWidth: 50},
          "name": {columnWidth: 60},
          "contact": {columnWidth: 80},
          "isbn": {columnWidth: 80},
          "title": {columnWidth: 110},
          "bdate": {columnWidth: 50},
          "odate": {columnWidth: 50},
          "fine": {columnWidth: 40}
        },
        margin: {top: 150},
        drawCell: function(cell, data) {
          let rows = data.table.rows;
          if (data.row.index == rows.length - 1) {
            doc.setFillColor(224,224,224);
            doc.setFontSize(11);

          }
        },
        addPageContent: function(data) {
          doc.addImage(imgData, 'PNG', 125,5,330,90);
          doc.setFontSize(18);
          doc.text("Overdue Fine Details",215,126);
        }
      });


      doc.save('Library-Dues-Report.pdf');
      let string = doc.output('datauristring');
      let iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
      let x = window.open();
      x.document.open();
      x.document.write(iframe);
      x.document.close();

    });
  }

  // when something is typed on the student search bar
  onKeyStudentSearch(event: any) {
    this.studentService.filterStudentDetails(this.searchText).subscribe(response=>{
      if(response.msg==""){
        this.message="No search results found";
      }
      else{
        this.message="";
      }
      this.students = response.msg;
    });
  }

  // after selecting the student print the report
  onStudentSelect(student) {
    let details = {email: student.email, enteredText: ""};
    this.bookService.filterReturnDetailsStudent(details).subscribe(res => {
      if (res.msg == "") {
        this.message = "No search results found";
      }
      else {
        this.message = "";
      }
      this.books = res.msg;

      // generate report
      let columns = [
        {title: "ISBN", dataKey: "isbn"},
        {title: "Title", dataKey: "title"},
        {title: "Subject/Category", dataKey: "subject"},
        {title: "Borrowed Date", dataKey: "bdate"},
        {title: "Returned Date", dataKey: "rdate"},
        {title: "Fine (Rs.)", dataKey: "fine"},
      ];
      let rows = [];

      let i;
      for (i = 0; i < this.books.length; i++) {
        let currentFine = 0;
        if (this.books[i].fine!=null){
          currentFine = this.books[i].fine;
        }
        let book = {
          "isbn": this.books[i].isbn,
          "title": this.books[i].title,
          "subject": this.books[i].subject,
          "bdate": this.books[i].borrowed_date,
          "rdate": this.books[i].returned_date,
          "fine": currentFine
        };
        rows.push(book);
      }

      html2canvas(document.querySelector("#captureBorrowHistory")).then(function (canvas) {
        const imgData = canvas.toDataURL("image/png");

        // Only pt supported (not mm or in)
        let doc = new jsPDF('p', 'pt');
        doc.autoTable(columns, rows, {
          styles: {overflow:"linebreak",fontSize:8,halign:'center'},
          headerStyles: {fillColor:[142,78,156]},
          columnStyles: {
            "isbn": {columnWidth: 80},
            "title": {columnWidth: 200},
            "subject": {columnWidth: 80},
            "bdate": {columnWidth: 50},
            "rdate": {columnWidth: 50},
            "fine": {columnWidth: 50}
          },
          margin: {top: 200},
          addPageContent: function(data) {
            doc.addImage(imgData, 'PNG', 125,5,330,90);
            doc.setFontSize(18);
            doc.text("Borrow History",218,126);
            doc.setFontSize(10);

            doc.text("Index No: ",55,150);
            doc.text(student.index_no,110,150);

            doc.text("Reg No: ",55,162);
            doc.text(student.reg_no,110,162);

            doc.text("Name: ",55,174);
            doc.text(student.name,110,174);

            doc.text("Email: ",255,150);
            doc.text(student.email,305,150);

            doc.text("Phone: ",255,162);
            doc.text(student.phone,305,162);

            doc.text("Address: ",255,174);
            doc.text(student.address,305,174);
          }
        });

        doc.save('Borrow-History-Report-'+student.index_no+'.pdf');
        let string = doc.output('datauristring');
        let iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
        let x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
      });

    });
  }
}
