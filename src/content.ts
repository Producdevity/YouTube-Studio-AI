function generateComment(replyButton: HTMLElement, tone: string, email: string) {
  console.log('TODO: Implement comment generation logic here', {
    replyButton,
    tone,
    email,
  })
}

function addGenerateButtons() {
  // Select all reply buttons on the page
  const replyButtons = document.querySelectorAll(
    'ytcp-comment-button#cancel-button.style-scope.ytcp-commentbox',
  ) // Adjust the selector based on actual button ID or class

  replyButtons.forEach((replyButton) => {
    if (!replyButton?.parentNode) throw new Error('Reply button not found')

    if (!replyButton.parentNode.querySelector('.generate-comment-button')) {
      // Check if the button is already added
      // Create the Generate Comment button with the required span tags and classes
      const generateButton = document.createElement('button')
      generateButton.className =
        'generate-comment-button ytcp-button-shape-impl ytcp-button-shape-impl--tonal ytcp-button-shape-impl--mono ytcp-button-shape-impl--size-m' // Use a class to distinguish multiple buttons

      // Add the inner spans for the button
      generateButton.innerHTML = `
                <span class="btn-text">Generate Comment</span>
                <span class="loader ytcp-button-shape-impl--mono"></span>
            `

      // Create the custom dropdown for tone selection
      const toneSelector = document.createElement('div')
      toneSelector.className = 'tone-selector custom-dropdown    '
      toneSelector.innerHTML = `
                <div class="dropdown-trigger
                ytcp-button-shape-impl ytcp-button-shape-impl--size-m ytcp-button-shape-impl--tonal ytcp-button-shape-impl--mono">

                <span class="selected-option">
                    Select Tone
                </span>

                <span class="dropdown- ytcp-button-shape-impl--mono">
                    &#9662;
                </span> 
                
                </div>
                <ul class="dropdown-options">
                    <li data-value="neutral">Neutral</li>
                    <li data-value="formal">Formal</li>
                    <li data-value="casual">Casual</li>
                    <li data-value="supportive">Supportive</li>
                    <li data-value="disagree">Disagree</li>
                    <li data-value="hahaha">Hahaha</li>
                    <li data-value="posh">Posh</li>
                    <li data-value="witty">Witty</li>
                    <li data-value="sarcastic">Sarcastic</li>
                    <li data-value="roast">Roast</li>
                    <li data-value="GenZ-slang">GenZ Slang</li>
                    <li data-value="playful">Playful</li>
                    <li data-value="nerdy">Nerdy</li>
                </ul>
            `

      // Inject the tone selector and the button next to the Reply button
      replyButton.parentNode.insertBefore(toneSelector, replyButton.nextSibling)
      replyButton.parentNode.insertBefore(generateButton, toneSelector.nextSibling)

      // Add click event listener to the button
      generateButton.addEventListener('click', async () => {
        const selectedTone = toneSelector.querySelector('.selected-option')?.textContent

        if (!selectedTone) throw new Error('Selected tone not found')

        // Retrieve email from Chrome storage
        chrome.storage.local.get('user_email', async (result) => {
          const email = result.user_email

          if (!email) throw new Error('Email not found in Chrome storage.')

          generateComment(replyButton as HTMLElement, selectedTone, email)
        })
      })

      // Add custom dropdown functionality
      setupDropdown(toneSelector)
    }
  })
}

// Function to set up custom dropdown functionality
function setupDropdown(toneSelector: HTMLDivElement) {
  const trigger = toneSelector.querySelector('.dropdown-trigger') as HTMLElement
  const optionsContainer = toneSelector.querySelector('#optionsContainer') as HTMLElement
  const selectedOption = toneSelector.querySelector('#selectedOption') as HTMLElement

  // Toggle dropdown visibility
  trigger.addEventListener('click', () => {
    optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block'
  })

  // Query all <li> elements within the optionsContainer and type them as HTMLLIElement
  const options: NodeListOf<HTMLLIElement> = optionsContainer.querySelectorAll('li')

  // Handle option selection using arrow functions
  options.forEach((option: HTMLLIElement) => {
    option.addEventListener('click', (event: MouseEvent) => {
      const target = event.currentTarget as HTMLLIElement
      selectedOption.textContent = target.textContent
      optionsContainer.style.display = 'none'
    })
  })

  // Close dropdown if clicked outside
  document.addEventListener('click', (event: MouseEvent) => {
    if (toneSelector.contains(event.target as Node)) return
    optionsContainer.style.display = 'none'
  })
}

function observeMutations() {
  const observer = new MutationObserver(() => {
    addGenerateButtons() // Re-run the button addition logic whenever DOM changes
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

// Initial setup
addGenerateButtons() // Add Generate Comment buttons
observeMutations() // Start observing DOM changes
