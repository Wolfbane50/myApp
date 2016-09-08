var read_eval_data = function() {

  var XLSX = require('xlsx');
  var workbook = XLSX.readFile('evaluation_data.xlsx');

  var children_data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Children']);
  var adult_data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Adults']);

  var child = {};
  children_data.forEach(function(row) {

    child[row.name] = {
      "high": parseInt(row.high),
      "weight": parseInt(row.weight),
      "name": row.name,
      "low": parseInt(row.low)
    };
  });
  var adult = {};
  adult_data.forEach(function(row) {

    adult[row.name] = {
      "high": parseInt(row.high),
      "weight": parseInt(row.weight),
      "name": row.name,
      "low": parseInt(row.low)
    };
  });



  return {
    "Children": child,
    "Adults": adult
  };

};



var build_pick_array = function(eval_hash) {

  // console.log("Building pick array from " + JSON.stringify(eval_hash));
  var pick_array = [];
  for (var name in eval_hash) {
    //foreach var name (keys %$eval_hash) {
    //console.log("Entry:   " + name);
    var weight = eval_hash[name].weight;
    //console.log("weight:   " + weight);
    var num_entries = Math.ceil(10.0 * weight);
    for (var i = 0; i < num_entries; i++) {
      pick_array.push(name);
    }
  }

  return pick_array;
}

var pick_a_piece = function(eval_hash, pick_array) {


  // Need to do this each time
  var index = Math.floor(Math.random() * pick_array.length);
  var item = pick_array[index];
  return eval_hash[item];


}

var pick_a_price = function(item_rec) {

  var low_price = item_rec.low;
  var high_price = item_rec.high;
  var price = low_price + ((high_price - low_price) * Math.random());

  // Format to the nearest 10 cents
  var pr_str = price.toFixed(1) + '0';
  //console.log ("Price from " + low_price + "," + high_price + " is " + pr_str);
  return pr_str;

}

var pick_bag_distribution = function() {
  // Randomize total number of items between 21 and 15
  var total_items = 10.0 + (Math.random() * 11);

  // Randomize the child/adult ration between 3/2 and 5/2
  var ac_ratio = (2.0 / 5.0) + (((2.0 / 3.0) - (2.0 / 5.0)) * Math.random());

  var child_items = (1.0 - ac_ratio) * total_items;
  var adult_items = ac_ratio * total_items;

  return [Math.floor(child_items), Math.floor(adult_items)];
};

var calculate_charity_bags = function(charity, date, num_bags) {
  var eval_data = read_eval_data();
  //console.log("Evaluation data = " + JSON.stringify(eval_data));
  var child_eval_data = eval_data.Children;
  var adult_eval_data = eval_data.Adults;

  var child_pick_array = build_pick_array(child_eval_data);
  var adult_pick_array = build_pick_array(adult_eval_data);
  var dt = new Date(date);
  var months = ["January", "February", "March", "April", "May", "June", "July",
               "August", "September", "October", "November", "December"];
  var dateString = dt.getDate() + " " + months[dt.getMonth()] + " " + dt.getFullYear();

  var manifest = {
    "bags": num_bags,
    "charity": charity,
    "date": dateString,
    "total": 0,
    "items": []
  };

  for (var i = 0; i < num_bags; i++) {
    var bag_of_items = {
      "items": [],
      "total_price": 0
    };

    var dist_array = pick_bag_distribution();
    var child_items = dist_array[0];
    var adult_items = dist_array[1];
    //	   console.log("For this bag, there will be " + child_items + " child items and " + adult_items + " adult items");

    for (var j = 0; j < child_items; j++) {
      var picked_piece = pick_a_piece(child_eval_data, child_pick_array);
      //console.log("Picked piece = " + JSON.stringify(picked_piece));
      var price = pick_a_price(picked_piece);
      manifest.total = (parseFloat(manifest.total) + parseFloat(price)).toFixed(2);
      var item = {
        "name": picked_piece.name,
        "price": price
      };
      manifest.items.push(item);
    }
    for (j = 0; j < adult_items; j++) {
      var picked_piece = pick_a_piece(adult_eval_data, adult_pick_array);
      var price = pick_a_price(picked_piece);
      manifest.total = (parseFloat(manifest.total) + parseFloat(price)).toFixed(2);
      var item = {
        "name": picked_piece.name,
        "price": price
      };
      manifest.items.push(item);
    }
  }
  return manifest;

};

// Hand test
//var num_bags = Math.ceil(Math.random() * 5);
//var man = calculate_charity_bags("My Charity", "15 April 2015", num_bags);
//console.log(JSON.stringify(man));

module.exports.calculate = function(charity, date, num_bags) {
  return calculate_charity_bags(charity, date, num_bags);
};
