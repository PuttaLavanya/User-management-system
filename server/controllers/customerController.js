const Customer = require("../models/Customer");
const mongoose = require("mongoose");

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  // Remove
  const messages = await req.consumeFlash('info');
  // Use this instead
  // messages = await req.flash("info");

  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 10;
  let page = req.query.page || 1;

  try {
    const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    // Count is deprecated. Use countDocuments({}) or estimatedDocumentCount()
    // const count = await Customer.count();
    const count = await Customer.countDocuments({});

    res.render("index", {
      locals,
      customers,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.about = async (req, res) => {
    const locals = {
      title: 'About',
      description: 'Free NodeJs User Management System'
    }

    try {
      res.render('about', { locals } );
    } catch (error) {
      console.log(error);
    }
}

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
  const locals = {
    title: "About",
    description: "Free NodeJs User Management System",
  };

  try {
    res.render("about", locals);
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * New Customer Form
 */
exports.addCustomer = async (req, res) => {
  const locals = {
    title: "Add New Customer - NodeJs",
    description: "Free NodeJs User Management System",
  };

  res.render("customer/add", locals);
};

/**
 * POST /
 * Create New Customer
 */
exports.postCustomer = async (req, res) => {
  console.log(req.body);

  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    details: req.body.details,
    tel: req.body.tel,
    email: req.body.email,
  });

  try {
    await Customer.create(newCustomer);
    await req.flash("info", "New customer has been added.");

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req, res) => {
    try {
        const customer = await Customer.findOne({_id: req.params.id})
        const locals = {
            title: "view customer",
            description: "Free NodeJs User Management System",
          };
        res.render('customer/view',{
            locals,
            customer
        })
    } catch (error) {
        console.log(error)
    }
 
}

exports.edit = async (req, res) => {
  try {
      const customer = await Customer.findOne({_id: req.params.id})
      const locals = {
          title: "edit customer",
          description: "Free NodeJs User Management System",
        };
      res.render('customer/edit',{
          locals,
          customer
      })
  } catch (error) {
      console.log(error)
  }

}

exports.editPost = async (req, res) => {
  try {
      const customer = await Customer.findByIdAndUpdate(req.params.id,{
        firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now(),

  });
  await res.redirect(`/edit/${req.params.id}`)
  } catch (error) {
      console.log(error)
  }

}


exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};


exports.searchCustomers = async (req, res) => {

  const locals = {
    title: "Search Customer",
    description: "Free NodeJs User Management System",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
    
    const customers = await Customer.find({
      $or: [
        { firstName : {$regex: new RegExp(searchNoSpecialChar, 'i')}},
        { lastName : {$regex: new RegExp(searchNoSpecialChar, 'i')}}
      ]
    });

    res.render('customer/search',{
      customers, 
      locals 
    })
    
  } catch (error) {
    console.log(error);
  }

};
