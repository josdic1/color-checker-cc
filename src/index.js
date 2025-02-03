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
  //render message
  function renderMessage(sysMessage) {
    const messageHtml = `
    <label for="messageText"> System message: </label>
    <span id='messageText'>${sysMessage || ""}</span>
    `

    message.innerHTML = messageHtml
  }

  // color cube
  function renderColorCube(colorObj) {
    const { title, code } = colorObj
    const colorCubeHtml =
      `<h1 id="text" style="color: ${code}">${title || "EMPTY"}</h1>`

    cube.innerHTML = colorCubeHtml

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
            <button type='button' name='clear' id='clear'>Clear</button>`

    form.innerHTML = formHtml

    const testBtn = document.getElementById("test")
    testBtn.addEventListener('click', function () {
      let titleVal = document.getElementById('title').value || ''
      let codeVal = document.getElementById('code').value || ""
      formData = {
        title: titleVal,
        code: codeVal
      }
      const colorToTest = formData
      renderColorCube(colorToTest)
    })

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
        btnName = id.split('-')[0].trim()
        colorId = id.split('-')[1].trim()
        const colorObj = colors.find(color => color.id === colorId)
        selectedColor = colorObj
        if (btnName === "view") {
          renderMessage(colorObj.code ? `Viewing ${colorObj.title}` : '')
          renderColorCube(colorObj)
        } else {
          if (btnName === 'edit') {
            inEditMode = true
            populateForm(colorObj)
          } else {
            if (btnName === 'del') {
              deleteColor(colorObj)
            }
          }
        }
      }
    })
  }

  function populateForm(color) {
    const { title, code } = color
    document.getElementById('title').value = title
    document.getElementById('code').value = code
    renderMessage(`Form populated...${title} / ${code}`)
  }



  /** --------------------- 🎯 HANDLER FUNCTIONS --------------------- **/

  function handleFormInput(e) {
    renderMessage(inEditMode ? "handling form input (edit mode)" : "handling form input (create mode)")
    const { id, value } = e.target
    formData = {
      ...formData,
      [id]: value
    }
  }


  function handleSubmitClick(e) {
    e.preventDefault()

    let titleVal;
    let codeVal;
    let obj = {}

    const titleInput = document.getElementById('title')
    const codeInput = document.getElementById('code')

    titleVal = titleInput.value
    codeVal = codeInput.value
    console.log(titleVal)
    console.log(codeVal)
    const reformattedTitle = titleVal.replace(/[^a-zA-Z-]/g, '-').toLowerCase()
    titleVal = reformattedTitle

    const reformattedCode = codeVal[0] === "#" ? codeVal : "#" + codeVal
    codeVal = reformattedCode.toLowerCase()

    if (inEditMode) {
      selectedColor = {
        id: selectedColor.id,
        title: titleVal,
        code: codeVal
      }
      obj = selectedColor
      updateColor(obj)

    } else {
      formData = {
        title: titleVal,
        code: codeVal
      }
      obj = formData
      createColor(obj)
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
      const mostRecentColor = data[data.length - 1]
      colors = data

      renderMessage()
      renderColorCube(mostRecentColor)
      renderColorList(data)
      renderColorForm()

    } catch (error) { console.error('GET: ', error) }
  }

  async function createColor(color) {
    let mess;
    const newColor = color
    try {
      const r = await fetch(`http://localhost:3000/colors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newColor)
      })
      if (!r.ok) {
        throw new Error('Bad response attempting to create new color')
      }
      const data = await r.json()
      const updatedList = [...colors, data]
      mess = updatedList.length === colors.length ? "Nahh" : "Successfuly created"
      colors = updatedList
      fetchColors()
      renderMessage(mess)
    } catch (error) { console.error('POST: ', error) }
  }

  async function deleteColor(color) {
    let mess;
    const colorId = color.id

    try {
      const r = await fetch(`http://localhost:3000/colors/${colorId}`, {
        method: 'DELETE'
      })

      const data = await r.json()
      const updatedList = colors.filter(color => color.id !== data.id)
      mess = updatedList.length === colors.length ? "Nahh" : "Successfuly deleted"
      colors = updatedList
      renderColorList(updatedList)
      renderMessage(mess)
    } catch (error) { console.error('DELETE: ', error) }
  }



  async function updateColor(updatedColor) {
    let mess;

    try {
      mess = "Starting update of" + updatedColor.title
      renderMessage(mess)

    } catch (error) { console.error('PATCH: ', error) }
  }




  /** --------------------- 🗑️ CLEANUP FUNCTIONS --------------------- **/
  function cleanUp() {
    console.log('cleanup started')
    inEditMode = false
    isLoading = true
    document.getElementById('title').value = ''
    document.getElementById('code').value = ''
    formData = { title: '', code: '' }
    selectedColor = { id: '', title: '', code: '' }
    console.log('cleanup ended')
  }

  /** --------------------- 🚀 INIT APP --------------------- **/

}

window.addEventListener("DOMContentLoaded", init)


