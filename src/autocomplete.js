export default function () {
  let inp = document.querySelector('#topicSearch');
  let topics = document.querySelectorAll('.main h3');

  var currentFocus;

  inp.addEventListener('input', function (e) {
    let items,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;

    items = document.createElement('DIV');
    items.setAttribute('id', this.id + 'autocomplete-list');
    items.setAttribute('class', 'autocomplete-items');

    this.parentNode.appendChild(items);

    topics.forEach( topic => {
      let topicName = topic.innerHTML;
      /*check if the item starts with the same letters as the text field value:*/
      if (topicName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

        let category = topic.closest('.category').querySelector('h2');

        let item = document.createElement('DIV');
        item.className = 'autocomplete-item';
        
        let link = document.createElement('a');
        link.href = `#${topic.id}`;
        link.value = topicName;
        /*make the matching letters bold:*/
        link.innerHTML = `${category.innerHTML}: <strong>${topicName.substr(0, val.length)}</strong>${topicName.substr(val.length)}`;

        item.appendChild(link);

        item.addEventListener('click', function (e) {
          /*insert the value for the autocomplete text field:*/
          let link = this.getElementsByTagName('a')[0];
          inp.value = link.value;

          link.click();

          closeAllLists();
        });
        items.appendChild(item);
      }
    })
      
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener('keydown', function (e) {
    let list = document.getElementById(this.id + 'autocomplete-list');
    if (!list) {
      return;
    } 

    let items = list.getElementsByTagName('div');
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(items);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(items);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (items) items[currentFocus].click();
      }
    }
  });

  function addActive (items) {
    /*a function to classify an item as "active":*/
    if (!items) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    /*add class "autocomplete-active":*/
    items[currentFocus].classList.add('autocomplete-active');
  }

  function removeActive (items) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('autocomplete-active');
    }
  }

  function closeAllLists (elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var items = document.getElementsByClassName('autocomplete-items');
    for (var i = 0; i < items.length; i++) {
      if (elmnt != items[i] && elmnt != inp) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
  });
}
