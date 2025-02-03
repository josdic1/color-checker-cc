/** --------------------- 🏗️ INITIAL SETUP --------------------- **/

import { titleCleaner, codeCleaner } from "./helper.js"
const init = () => {

  /** --------------------- DOM Elements--------------------- **/
  const message = document.getElementById("color-message")
  const cube = document.getElementById("color-cube")
  const form = document.getElementById("color-form")
  const list = document.getElementById("color-list")

  /** --------------------- STATEFUL VARS--------------------- **/
  let isLoading = true
  let inEditMode = false
  let colors = []
  let formData = { title: '', code: '' }
  let selectedColor = { id: '', title: '', code: '' }

  /** --------------------- INIT FETCH --------------------- **/

  fetchColors()

  /** ---------------------EVENT LISTENERS  --------------------- **/
  form.addEventListener('input', handleFormInput)
  form.addEventListener('submit', handleSubmitClick)


  /** --------------------- 🎨 RENDER FUNCTIONS --------------------- **/

  //message center
  function renderMessage() {

  }

  // color cube
  function renderColorCube() {



  }

  // color form
  function renderColorForm() {
    const formHtml =
      `<label for="title" > Color </label>
    <input id='title' name='title' placeholder='Color name here...' />
    <label for="code" > Code </label>
    <input id='code' name='code' placeholder='Color code here...' />
      <button type='button' name='test' id='test'>Test</button>
         <button type='submit' name='submit' id='submit'>Submit</button>
            <button type='button' name='clear' id='clear'>Clear</button>
    `

    form.innerHTML = formHtml


    const testBtn = document.getElementById("test")
    testBtn.addEventListener('click', function () {
      let titleVal = document.getElementById('title').value || ''
      let codeVal = document.getElementById('code').value || ""
      formData = {
        title: titleVal,
        code: codeVal
      }
      if (codeVal) {
        renderColorCube(codeVal)
      } else {
        renderColorCube("#fff")
      }
    })


    const clearBtn = document.getElementById("clear")
    clearBtn.addEventListener('click', clearForm)
    function clearForm() {
      document.getElementById('title').value = ''
      document.getElementById('code').value = ''
      inEditMode = false
    }
  }

  // color list
  function renderColorList(data) {

    const listMap = data.map(item => (
      `<tr id=${item.id}>
        <td>${item.id}</td>
         <td>${item.title}</td>
          <td>${item.code}</td>
          <td>
            <button type='button' button id='view-${item.id}'>View</button>
          </td>
          <td>  
            <button type='button' button id='edit-${item.id}'>Edit</button>
          </td>
          <td>  
            <button type='button' button id='del-${item.id}'>Del</button>
          </td>
      </tr>`
    ))

    const listHtml =
      `<table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Color</th>
            <th>Code</th>
            <th>View</th>
            <th>Edit</th>
            <th>Del</th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          ${listMap.join('')}
        </tbody>
      </table>`

    list.innerHTML = listHtml

    let btnName;
    let colorId;
    list.addEventListener('click', function (e) {
      const { id, tagName } = e.target
      if (tagName === 'BUTTON') {
        btnName = id.split('-')[0]
        colorId = id.split('-')[1]
        const colorObj = colors.find(color => color.id === colorId)
        selectedColor = colorObj
        switch (btnName) {
          case 'view':
            return renderColorCube(colorObj)
          case 'edit':
            inEditMode = true
            return populateForm(colorObj)
          case 'del':
            return deleteColor(colorObj)
          default:
            break;
        }
      }
    })

  }

  function populateForm(color) {
    document.getElementById('title').value = color.title
    document.getElementById('code').value = color.code
    selectedColor = color
  }



  /** --------------------- 🎯 HANDLER FUNCTIONS --------------------- **/

  function handleFormInput(e) {
    let objToReformat = {}
    const { id, value } = e.target
    if (!inEditMode) {
      formData = {
        ...formData,
        [id]: value
      }
      objToReformat = formData
    } else {
      if (inEditMode) {
        selectedColor = {
          ...selectedColor,
          [id]: value
        }
        objToReformat = selectedColor
      }
    }
    reformatter(objToReformat)
  }


  function reformatter(obj) {
    console.log('inedItMode: ', inEditMode + obj)
    let cleanTitle = titleCleaner(obj.title)
    let cleanCode = codeCleaner(obj.code)
    if (!inEditMode) {
      formData = {
        ...obj,
        title: cleanTitle,
        code: cleanCode
      }
    } else {
      selectedColor = {
        ...obj,
        title: cleanTitle,
        code: cleanCode
      }

    }
    console.log('formData: ', formData)
    console.log('selectedColor: ', selectedColor)
  }


  function handleSubmitClick(e) {
    e.preventDefault()
    let objToSubmit;

    if (inEditMode) {
      objToSubmit = selectedColor
      updateColor(objToSubmit)
    } else {
      objToSubmit = formData
      createColor(objToSubmit)
    }
  }

  /** --------------------- 🛠️ UTILITY FUNCTIONS --------------------- **/


  /** --------------------- 📡 API CALLS --------------------- **/

  async function fetchColors() {
    try {
      const r = await fetch(`http://localhost:3000/colors`)
      if (!r.ok) {
        throw new Error('Bad GET response')
      }
      const data = await r.json()
      const mostRecentColor = data[data.length - 1].code
      renderMessage()
      renderColorCube(mostRecentColor)
      renderColorList(data)
      renderColorForm()
      colors = data
    } catch (error) { console.error('GET: ', error) }
  }

  async function createColor(newColor) {
    try {
      const r = await fetch(`http://localhost:3000/colors`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newColor)
      });

      if (!r.ok) {
        throw new Error("fetch error in POST");
      }
      const data = await r.json();
      console.log('created color: ', data)
      const updatedList = [...colors, data]
      await fetchColors();
    } catch (error) {
      console.error(error);
    }
  }


  async function deleteColor(colorObj) {
    const updatedList = colors.filter(color => color.id !== colorObj.id)
    try {
      const r = await fetch(`http://localhost:3000/colors/${colorObj.id}`, {
        method: 'DELETE'
      })
      if (!r.ok) {
        throw new Error("fetch error in DELETE");
      }
      await fetchColors();
    } catch (error) { console.error(error) }
  }


  async function updateColor(editColor) {
    try {
      const r = await fetch(`http://localhost:3000/colors/${editColor.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editColor)
      })
      if (!r.ok) {
        throw new Error('fetch error in PATCH')
      }
      await fetchColors()
    } catch (error) { console.error(error) }
  }




  /** --------------------- 🗑️ CLEANUP FUNCTIONS --------------------- **/


  /** --------------------- 🚀 INIT APP --------------------- **/

}

window.addEventListener("DOMContentLoaded", init)