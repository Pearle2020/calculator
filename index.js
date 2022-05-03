const { app, BrowserWindow } = require('electron');

function createWindow() {
    mainwindow = new BrowserWindow({
        width: 800,
        height: 600,
    })
    mainwindow.loadFile('index.html')
    mainwindow.maximize();
    mainwindow.show();
};
function createChildwindow() {
    Childwindow = new BrowserWindow({
        width: 1000,
        height: 700,
        parent: mainwindow,
    });
    Childwindow.loadFile("settings.html");
    Childwindow.once("result", () => {
        Childwindow.show();
    });
    app.whenReady().then(() => {
        createWindow();

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
    function calculate() {

        ipc.send('openchildwindow');
    }
}

const loanForm = document.getElementById('calculate-loan-form')
loanForm.addEventListener('submit', function (e) {
    e.preventDefault()
    start_loader();
    const principalAmount = document.getElementById('loan-amount').value;
    const interest = document.getElementById('loan-interest').value;
    const PayableYears = document.getElementById('loan-years').value;
    var monthly = 0,
        pmt = 0,
        total = 0,
        totalInterest = 0,
        monthlyInterest = 0;
    monthlyInterest = (parseFloat(principalAmount) * (parseFloat(interest) / 100)) / 12;
    pmt = parseFloat(monthlyInterest) / (1 - Math.pow(1 + ((parseFloat(interest) / 100) / 12), -12 * parseFloat(PayableYears)));
    total = parseFloat(pmt) * Math.floor(parseFloat(PayableYears) * 12);
    totalInterest = parseFloat(total) - parseFloat(principalAmount);
    setTimeout(() => {
        document.getElementById('principal').textContent = parseFloat(principalAmount).toLocaleString("en-US", { style: "decimal", maximumFractionDigits: 2 })
        document.getElementById('annual-interest').textContent = parseFloat(interest).toLocaleString("en-US", { style: "decimal", maximumFractionDigits: 2 }) + "%";
        document.getElementById('loan-terms').textContent = parseFloat(PayableYears).toLocaleString("en-US", { style: "decimal", maximumFractionDigits: 2 }) + (PayableYears > 1 ? " Yrs." : "")
        document.getElementById('monthly-pay').textContent = parseFloat(pmt).toLocaleString("en-US", { style: "decimal", maximumFractionDigits: 2 })
        document.getElementById('total-pay').textContent = parseFloat(total).toLocaleString("en-US", { style: "decimal", maximumFractionDigits: 2 })
        document.getElementById('total-interest').textContent = parseFloat(totalInterest).toLocaleString("en-US", { style: "decimal", maximumFractionDigits: 2 })
        document.getElementById('result').style.display = 'table';
        document.getElementById('reset-btn').style.display = 'block';
        end_loader()
    }, 500)

})
loanForm.addEventListener('reset', function (e) {
    start_loader();
    setTimeout(() => {
        document.getElementById('principal').textContent = ""
        document.getElementById('annual-interest').textContent = ""
        document.getElementById('loan-terms').textContent = ""
        document.getElementById('monthly-pay').textContent = ""
        document.getElementById('total-pay').textContent = ""
        document.getElementById('total-interest').textContent = ""
        document.getElementById('result').style.display = 'none';
        document.getElementById('reset-btn').style.display = 'none';
        end_loader()
    }, 500)
})





