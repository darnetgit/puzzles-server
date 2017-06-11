/**
 * Created by user on 02/06/2017.
 */
/**
 * Created by D on 02-Jun-17.
 */
var express = require('express'); // Loading the express module to the server.
var bodyParser = require('body-parser')
var app = express(); // activating express
var cors = require('cors');
var Connection = require('tedious').Connection;
app.use(cors());
app.use(bodyParser.json()); // Enabling access to "req.body" as a json file.

var array=[];
var Request=require('tedious').Request;
var TYPES=require('tedious').TYPES;
var config = {
    userName: 'puzzle',
    password: 'cardar1!',
    server: 'puzzle.database.windows.net',
    requestTimeout: 30000,
    options: {encrypt: true, database: 'PuzzleStore'}
};

var connection = new Connection(config)
connection.on('connect', function(err) {
    if (err) {
        console.error('error connecting; ' + err.stack);
        return;
    }
    console.log("connected Azure");
    //AddToCart(1,'car',10,'1992-09-12');
    DisplayCart('car');
    console.log(array);

});

//-------------------------------Post - AddToCart-------------------------------
function AddToCart(itemID,username,quantity,deliverdate){
    var query="Insert into Cart (itemID,username,quentity,orderdate) values(@itemID, @username,@quantity,@deliverdate)";
    Request=new Request(query, function (err) {
        if(err){
            console.log(err);
        }
    });
    Request.addParameter('itemID',TYPES.VarChar,itemID);
    Request.addParameter('username',TYPES.VarChar,username);
    Request.addParameter('quantity',TYPES.VarChar,quantity);
    Request.addParameter('deliverdate',TYPES.VarChar,deliverdate);
    connection.execSql(Request);
}

//-------------------------------Post - DisplayCart-------------------------------NEED TO RETURN ARRAY!
function DisplayCart(username) {
    var query="SELECT * FROM Cart WHERE username=@username";
    Request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');
        connection.close();
    });
    Request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+'|';
        });
        array[array.length]=item;
    });
    Request.addParameter('username',TYPES.VarChar,username);
    connection.execSql(Request);

}

//-------------------------------Delete - DeleteProductFromCart-------------------------------
function DeleteProductFromCart(username,productID) {
    var query="DELETE FROM Cart WHERE username = @username AND itemID=@productID";
    Request=new Request(query, function (err, rowCount, rows) {
        console.log(rowCount+' rows(s) returned')
    });
    Request.addParameter('username',TYPES.VarChar,username);
    Request.addParameter('productID',TYPES.VarChar,productID);
    connection.execSql(Request);
}

//-------------------------------Post - ShowHistory-------------------------------NEED TO RETURN ARRAY!
function ShowHistory(username) {
    var array=[];
    var query="SELECT FROM Orders WHERE username=@username";
    Request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');
        connection.close();
    });
    Request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+'|';
        });
        array.push(item);
    });
    connection.execSql(Request);
    return array;
}

//-------------------------------Post - DisplayOrder-------------------------------NEED TO RETURN ARRAY!
function DisplayOrder(orderid) {
    var array=[];
    var query="SELECT FROM Orders WHERE orderid=@orderid";
    Request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');
        connection.close();
    });
    Request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+'|';
        });
        array.push(item);
    });
    connection.execSql(Request);
    return array;
}

//-------------------------------Post - MakeOrder-------------------------------
function MakeOrder(username){
    var insertqye="INSERT INTO Orders (itemID,quantity,orderdate,username) SELECT itemID,quentity,orderdate,username FROM Cart WHERE username=@username DELETE FROM Cart WHERE username=@username";
    Request=new Request(insertqye, function (err) {
        if(err){
            console.log(err);
        }
    });
    Request.addParameter('username',TYPES.VarChar,username);
    connection.execSql(Request);
}

//-------------------------------Get - AllUsers-------------------------------NEED TO RETURN ARRAY!
function AllUsers() {
    var array = [];
    var query = "SELECT * FROM Users";
    Request = new Request(query, function (err, rowCount) {
        if (err)
            console.log(err);
        if (rowCount == 0)
            console.log('no items');
        connection.close();
    });
    Request.on('row', function (columns) {
        var item = '';
        columns.forEach(function (column) {
            item += column.value + '|';
        });
        array.push(item);
    });
    connection.execSql(Request);
    return array;
}

//-------------------------------Post - AddProduct-------------------------------
function AddProduct(itemname,quantity, category,price, description, currentdate){
    var query="Insert into Items (itemName,numleft,price,category,description, dateadded) values(@itemname, @quantity,@price, @category,@description, @currentdate)";
    Request=new Request(query, function (err) {
        if(err){
            console.log(err);
        }
    });
    Request.addParameter('itemname',TYPES.VarChar,itemname);
    Request.addParameter('quantity',TYPES.VarChar,quantity);
    Request.addParameter('price',TYPES.VarChar,price);
    Request.addParameter('category',TYPES.VarChar,category);
    Request.addParameter('description',TYPES.VarChar,description);
    Request.addParameter('currentdate',TYPES.VarChar,currentdate);
    connection.execSql(Request);
}

//-------------------------------Delete - DeleteProduct-------------------------------
function DeleteProduct(productID) {
    var query="DELETE from Items WHERE itemID = @productID";
    Request=new Request(query, function (err, rowCount, rows) {
        console.log(rowCount+' rows(s) returned')
    });
    Request.addParameter('productID',TYPES.VarChar,productID);
    connection.execSql(Request);
}

//-------------------------------Delete - DeleteUser-------------------------------
function DeleteUser(username) {
    var query="DELETE from Users WHERE username = @username";
    Request=new Request(query, function (err, rowCount, rows) {
        console.log(rowCount+' rows(s) returned')
    });
    Request.addParameter('username',TYPES.VarChar,username);
    connection.execSql(Request);
}

//-------------------------------Post - UpdateInventory-------------------------------
function UpdateInventory(ProductID, Quantity) {
    var query="UPDATE Items SET numleft=@Quantity WHERE itemID=@ProductID";
    Request=new Request(query, function (err, rowCount, rows) {
        console.log(rowCount+' rows(s) returned')
    });
    Request.addParameter('ProductID',TYPES.VarChar,ProductID);
    Request.addParameter('Quantity',TYPES.VarChar,Quantity);
    connection.execSql(Request);
}
function GetQuantity(ProductID){
    var ans='';
    var query = "SELECT quentity FROM Items WHERE itemID=@ProductID";
    Request = new Request(query, function (err, rowCount) {
        if (err)
            console.log(err);
        if (rowCount == 0)
            console.log('no items');
        connection.close();
    });
    Request.on('row', function (columns) {
        columns.forEach(function (column) {
            ans = column.value;
            return ans;
        });
    });
    connection.execSql(Request);
} //NEED TO RETURN ARRAY!

function isQcorrect(un, answer){
    var query = 'SELECT restoreQ FROM Users WHERE username=@usern';

    request = new Request(query, function(err, rowCount) {
        if (err){
            console.log(err);
            return false;
        }
        if(rowCount==0){
            console.log('no such user');
            return false;
        }
        connection.close();
    });

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if(column.value==answer){
                console.log('Correct!');
                return true;
            }
            else
            {
                console.log('password does not match');
                return false;
            }
        });
    });
    request.addParameter('usern', TYPES.VarChar,un);
    connection.execSql(request);

}
function RestoreUserPassword(un,answer){
    var correct=isQcorrect(un,answer)
    if(correct){
        var query = 'SELECT password FROM Users WHERE username=@usern';
        request = new Request(query, function(err, rowCount) {
            if (err){
                console.log(err);
                return false;
            }
            if(rowCount==0){
                console.log('no such user');
                return false;
            }
            connection.close();
        });
        var ans;
        request.on('row', function(columns) {
            columns.forEach(function(column) {
                return column.value;
            });
        });
        request.addParameter('usern', TYPES.VarChar,un);
        connection.execSql(request);
    }
}

function filterbycategory(category){
    var filter= category.replace(/ /g, ' OR category=');
    console.log(filter);
    var query = 'SELECT * FROM Items where category=@filter';
    request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');
        connection.close();
    });
    request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+' ';
        });
        console.log(item);
    });
    request.addParameter('filter', TYPES.VarChar,filter);
    connection.execSql(request);
}

function SortPruducts(what,up){
    if(up=='down')
        what=what+' DESC';
    var query = 'SELECT * FROM Items Order by '+what;
    request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');
        connection.close();
    });
    request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+' ';
        });
        console.log(item);
    });

    connection.execSql(request);
}

function AllProducts(){
    var query = 'SELECT * FROM Items';

    request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');
        connection.close();
    });
    request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+' ';
        });
        console.log(item);
    });
    connection.execSql(request);
}

function TopFiveItems(){
    var items=[];
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    var dd = oneWeekAgo.getDate();
    var mm = oneWeekAgo.getMonth()+1; //January is 0!
    var yyyy = oneWeekAgo.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    var today = yyyy+'-'+mm+'-'+dd;

    var query = 'select * from (select top 5 itemID from Orders where orderdate>@un group by itemID Order by sum(quantity)) t1 inner join (SELECT * FROM Items) t2 on t1.itemID = t2.itemID';

    request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');

        connection.close();

    });
    request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+' ';
        });
        items.push(item);
        //console.log(items);
    });
    request.addParameter('un', TYPES.VarChar,today);
    connection.execSql(request);
    // console.log(items);
}

function NewProducts(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }
    if(mm<11)
        mm='0'+mm-1

    today = yyyy+'-'+mm+'-'+dd;

//console.log(today);
    var query = 'SELECT * FROM Items where [dateadded] < @un';

    request = new Request(query, function(err, rowCount) {
        if (err)
            console.log(err);
        if(rowCount==0)
            console.log('no items');
        connection.close();
    });
    request.on('row', function(columns) {
        var item='';
        columns.forEach(function(column) {
            item+=column.value+' ';
        });
        console.log(item);
    });
    request.addParameter('un', TYPES.VarChar,today);
    connection.execSql(request);

}

function doesuserexists(un){
    var query = "SELECT * FROM Users WHERE username=@un";
    request = new Request(query, function(err,rowCount) {
        if(rowCount>0){
            console.log("user already exists");
            return true;
        }
        else
            return false;
        if (err) {
            console.log(err);
            return false;}
    });
    request.addParameter('un', TYPES.VarChar,un);
    connection.execSql(request);

}

function LoginUser(un,pass){
    var query = 'SELECT password FROM [dbo].[Users] WHERE username=@usern';

    request = new Request(query, function(err, rowCount) {
        if (err){
            console.log(err);
            return false;
        }
        if(rowCount==0){
            console.log('no such user');
            return false;
        }
        connection.close();
    });

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if(column.value==pass){
                console.log('Welcome!');
                return true;
            }
            else
            {
                console.log('password does not match');
                return false;
            }
        });
    });
    request.addParameter('usern', TYPES.VarChar,un);
    connection.execSql(request);

}

function AddUser(un,pass,country,first,last,restore,email){
    var query = "Insert into Users (username,password,country,firstname,lastname,restoreQ,email) values (@un , @pass,@country,@first,@second,@restore,@email)";
    request = new Request(query, function(err) {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
    });
    request.addParameter('un', TYPES.VarChar,un);
    request.addParameter('pass', TYPES.VarChar , pass);
    request.addParameter('country', TYPES.VarChar,country);
    request.addParameter('first', TYPES.VarChar,first);
    request.addParameter('second', TYPES.VarChar,last);
    request.addParameter('restore', TYPES.VarChar,restore);
    request.addParameter('email', TYPES.VarChar,email);
    connection.execSql(request);
}
