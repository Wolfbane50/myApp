'use strict';
var request = require('request');
var fs = require('fs');
var async = require('async');

var theFiles = [
  "US-Population-115.jpg",
  "US-Taxpayers-115.jpg",
  "Private-Sector-Jobs-115.jpg",
  "Self-Employed-115.jpg",
  "Manufacturing-Jobs-115.jpg",
  "Manufacturing-Jobs-2000-115.jpg",
  "Disabled-115.jpg",
  "Persons-Without-Insurance-115.jpg",
  "US-National-Debt-115.jpg",
  "Debt-Per-Citizen-115.jpg",
  "Debt-Per-Taxpayer-115.jpg",
  "US-Budget-Deficit-115.jpg",
  "Federal-Revenue-%26-Increase-2000-115.jpg",
  "Federal-Revenue-Per-Citizen-115.jpg",
  "Income-Tax-Revenue-115.jpg",
  "Payroll-Tax-Revenue-115.jpg",
  "State-Revenue-115.jpg",
  "Local-Revenue-115.jpg",
  "State-Local-Revenue-Per-Citizen-115.jpg",
  "Defense-War-115.jpg",
  "Interest-on-Debt-Net-115.jpg",
  "Federal-Pensions-115.jpg",
  "GDP-%26-Increase-2000-115.jpg",
  "Total-Federal-State-Local-Spending-115.jpg",
  "Gross-Debt-to-GDP-Ratio-115.jpg",
  "Revenue-to-GDP-Ratio-115.jpg",
  "Spending-to-GDP-Ratio-115.jpg",
  "Total-Interest-115.jpg",
  "US-Total-Debt-%26-Increase-2000-115.jpg",
  "Interest-Per-Citizen-115.jpg",
  "Total-Debt-Per-Citizen-115.jpg",
  "Total-Debt-Per-Family-115.jpg",
  "Personal-Savings-Per-Family-115.jpg",
  "US-Personal-Debt-%26-Increase-2000-115.jpg",
  "Mortgage-Debt-115.jpg",
  "Student-Loan-Debt-115.jpg",
  "Credit-Card-Debt-115.jpg",
  "Personal-Debt-Per-Citizen-115.jpg",
  "Monetary-Base-%26-Increase-2000-115.jpg",
  "M2-Money-Supply-%26-Increase-2000-115.jpg",
  "Derivatives-%26-Increase-2000-115.jpg",
  "Small-Business-Assets-115.jpg",
  "Bottom-Small-Business-Assets.jpg",
  "Corporation-Assets-115.jpg",
  "Bottom-Corporation-Assets.jpg",
  "Household-Assets-115.jpg",
  "Bottom-Household-Assets.jpg",
  "Total-National-Assets-115.jpg",
  "Bottom-Total-National-Assets.jpg",
  "Assets-Per-Citizen-115.jpg",
  "Bottom-Assets-Per-Citizen.jpg",
  "Federal-Budget-Deficit-GAAP-115.jpg",
  "Bottom-Social-Security-Liability.jpg",
  "Social-Security-Liability-115.jpg",
  "Bottom-Presciption-Drug-Liability.jpg",
  "Unfunded-Liability-115.jpg",
  "Bottom-US-Unfunded-Liability.jpg",
  "Medicare-Liability-115.jpg",
  "Bottom-Medicare-Liability.jpg",
  "Unfunded-Liability-Per-Taxpayer-115.jpg",
  "Gevernment-Employees-115.jpg",
  "US-Retirees-115.jpg",
  "Union-Workers-115.jpg",
  "Living-in-Poverty-115.jpg",
  "Federal-Spending-%26-Increase-2000-115.jpg",
  "State-Debt-115.jpg",
  "Debt-Held-by-Foreign-Countries-115.jpg",
  "Trade-Deficit-115.jpg",
  "Trade-Deficit-China-115.jpg",
  "Imported-Oil-115.jpg",
  "Oil-Opec-115.jpg",
  "Treasury-Securities-%26-Increase-2000-115.jpg",
  "Social-Security-Spending-115.jpg",
  "Income-Security-115.jpg",
  "Medicare-Spending-115.jpg",
  "US-Workforce-115.jpg",
  "US-Workforce-2000-115.jpg",
  "Not-in-Labor-Force-115.jpg",
  "Not-In-Labor-Force-2000-115.jpg",
  "Median-Income-115.jpg",
  "Median-Income-2000-115.jpg",
  "Bankruptcies-115.jpg",
  "Foreclosures-115.jpg",
  "Veterans-115.jpg",
  "US-Armed-Forces-115.jpg",
  "Medicare-Enrolles-115.jpg",
  "Medicaid-Enrolles-115.jpg",
  "Monetary-Base-2000-115.jpg",
  "M2-Money-Supply-2000-115.jpg",
  "Treasury-Securities-2000-115.jpg",
  "Derivatives-2000-115.jpg",
  "Corporate-Tax-Revenue-115.jpg",
  "Local-Revenue-115.jpg",
  "Offical-Unemployed-115.jpg",
  "Actual-Unemployed-115.jpg",
  "Full-Time-Workers-115.jpg",
  "Part-Time-Workers-115.jpg",
  "Median-Home-115.jpg",
  "Median-Home-2000-115.jpg",
  "Prison-Inmates-115.jpg",
  "Convicted-Felons-115.jpg",
  "Public-School-Students-115.jpg",
  "Charter-School-Students-115.jpg",
  "Food-Stamps-115.jpg",
  "Total-Receiving-Benefits-115.jpg",
  "M2-Money-Increase-Now-115.jpg",
  "M2-Money-Increase-1913-115.jpg",
  "Dollar-Citizen-Ratio-Now-115.jpg",
  "Dollar-Citizen-Ratio-1913-115.jpg",
  "Dollar-NEW-Citizen-Ratio-Now-115.jpg",
  "Dollar-NEW-Citizen-Ratio-1913-115.jpg",
  "Dollar-Oil-Ratio-115.jpg",
  "Dollar-Oil-Ratio-1913-115.jpg",
  "Dollar-Silver-Ratio-Now-115.jpg",
  "Dollar-Silver-Ratio-1913-115.jpg",
  "Dollar-Gold-Ratio-Now-115.jpg",
  "Dollar-Gold-Ratio-1913-115.jpg",
  "Federal-Revenue-Per-Citizen-115.jpg",
  "State-Local-Revenue-Per-Citizen-115.jpg",
  "Deficit-to-GDP-Ratio-1980-115.jpg",
  "Deficit-to-GDP-Ratio-1990-115.jpg",
  "Deficit-to-GDP-Ratio-2000-115.jpg",
  "Deficit-to-GDP-Ratio-2010-115.jpg",
  "Deficit-to-GDP-Ratio-Now-115.jpg",
  "Revenue-to-GDP-Ratio-1900-115.jpg",
  "Revenue-to-GDP-Ratio-1950-115.jpg",
  "Revenue-to-GDP-Ratio-2000-115.jpg",
  "Revenue-to-GDP-Ratio-Now-115.jpg",
  "Income-Tax-Revenue-Per-Taxpayer-115.jpg",
  "Payroll-Tax-Per-Worker-115.jpg",
  "Tarriff-Tax-115.jpg",
  "Federal-Transfer-115.jpg",
  "Property-Taxes-115.jpg",
  "State-Local-Revenue-Per-Employee-115.jpg",
  "Unfunded-Public-Pension-Liabilities-115.jpg",
  "Municipal-Employees-115.jpg"
];

var theFiles1 = [ "Municipal-Employees-115.jpg" ];

var baseUrl = "http://www.usdebtclock.org/sources/";
var destDir = "server/public/elijpgs/";

var fileLookup = {};

async.eachSeries( theFiles, function(filenm, callback) {
//theFiles.forEach( function(filenm) {
  if (! fileLookup[filenm]) {
    fileLookup[filenm] = 1;
    var outfile = destDir + filenm;
    var jpgurl = baseUrl + filenm;

    request
        .get(jpgurl)
        .on('error', function(err) {
             console.log("My error " + err);
            return;
          })
          .pipe(fs.createWriteStream(outfile))
        ;
        callback();
  } else {
    callback();
  }

});
