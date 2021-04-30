const { validationResult } = require('express-validator/check');

const Contact = require('../models/contact');

exports.getindex = (req, res, next) => {
  res.redirect('/contacts')
};

exports.getAddContact = (req, res, next) => {
  res.render('admin/edit-contact', {
    pageTitle: 'Add Contact',
    path: '/admin/add-contact',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddContact = (req, res, next) => {
  const name = req.body.name;
  const mblnum = req.body.mblnum;
  const email = req.body.email;
   const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-contact', {
      pageTitle: 'Add Contact',
      path: '/admin/edit-contact',
      editing: false,
      hasError: true,
      contact: {
        name: name,
        email: email,
        mobilenumber: mblnum,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const contact = new Contact({
    name: name,
    email: email,
    mobilenumber: mblnum,
    userId: req.user
  });
  contact
    .save()
    .then(result => {
      console.log('CREATED CONTACT');
      res.redirect('/contacts');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditContact = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const contid = req.params.contactId;
  Contact.findById(contid)
    .then(contact => {
      if (!contact) {
        return res.redirect('/');
      }
      res.render('admin/edit-contact', {
        pageTitle: 'Edit Contact',
        path: '/admin/edit-contact',
        editing: editMode,
        contact: contact,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.postEditContact = (req, res, next) => {
  const contid = req.body.contactId;
  const updatedname = req.body.name;
  const updatedmblnum = req.body.mblnum;
  const updatedemail = req.body.email;
 
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-contact', {
      pageTitle: 'Edit Contact',
      path: '/admin/edit-contact',
      editing: true,
      hasError: true,
      contact: {
        name: updatedname,
        mobilenumber: updatedmblnum,
        email: updatedemail,
        _id: contid
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Contact.findById(contid)
    .then(contact => {
      if (contact.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      contact.name = updatedname;
      contact.mobilenumber = updatedmblnum;
      contact.email = updatedemail;
      return contact.save().then(result => {
        console.log('UPDATED CONTACT!');
        res.redirect('/contacts');
      });
    })
    .catch(err => console.log(err));
};

exports.getContacts = (req, res, next) => {
  Contact.find({ userId: req.user._id })
     
    .then(contacts => {
       
      res.render('admin/contacts', {
        conc: contacts,
        pageTitle: 'Contacts',
        path: '/admin/contacts'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteContact = (req, res, next) => {
  const contid = req.body.contactId;
  Contact.deleteOne({ _id: contid, userId: req.user._id })
    .then(() => {
      console.log('DESTROYED CONTACT');
      res.redirect('/contacts');
    })
    .catch(err => console.log(err));
};
