/** --------------------- 🏗️ INITIAL SETUP --------------------- **/

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
  function renderColorCube(colorCode) {

    const cubeHtml =
      `<h1 id="colorCube" style="color: ${colorCode}">COLOR</h1>`;
    cube.innerHTML = cubeHtml

  }

  // color form
  function renderColorForm() {
    const formHtml =
      `    <label for="title" > Color </label>
    <input id='title' name='title' placeholder='Color name here...' />
    <label for="code" > Code </label>
    <input id='code' name='code' placeholder='Include #...' />
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
            return renderColorCube(colorObj.code)
          case 'edit':
            inEditMode = true
            return populateForm(colorObj.title, colorObj.code)
          case 'del':
            return deleteColor(colorObj.id)
        }
      }
    })

  }

  function populateForm(title, code) {
    document.getElementById('title').value = title
    document.getElementById('code').value = code
  }



  /** --------------------- 🎯 HANDLER FUNCTIONS --------------------- **/
  function handleFormInput(e) {
    const { id, value } = e.target
    formData = {
      ...formData,
      [id]: value
    }
  }


  function handleSubmitClick(e) {
    e.preventDefault()
    if (!inEditMode) {
      const newColor = formData
      createColor(newColor)
    }
    clearForm()
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
          'Content-Type': 'application.json'
        },
        body: JSON.stringify(newColor)
      })
      if (!r.ok) {
        throw new Error('fetch error in POST')
      }
      const data = await r.json()
      const updatedList = [...colors, data]
      fetchColors(updatedList)
    } catch (error) { console.error(error) }
  }

  async function deleteColor(delColor) {
    try {
      const r = await fetch(`http://localhost:3000/colors/${delColor}`, {
        method: "DELETE",
      })
      if (!r.ok) {
        throw new Error('fetch error in DELETE')
      }
      const data = await r.json()
      const updatedList = colors.filter(color => color.id === data.id)
      fetchColors(updatedList)
    } catch (error) { console.error(error) }
  }


  /** --------------------- 🗑️ CLEANUP FUNCTIONS --------------------- **/
  //clear form
  function clearForm() {
    document.getElementById('title').value = ''
    document.getElementById('code').value = ''
    inEditMode = false
  }

  /** --------------------- 🚀 INIT APP --------------------- **/

}

window.addEventListener("DOMContentLoaded", init)