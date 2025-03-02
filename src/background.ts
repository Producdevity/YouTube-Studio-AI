chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Studio AI Extension Installed')
})

chrome.runtime.onMessage.addListener(
  (message, sender: chrome.runtime.MessageSender, sendResponse: VoidFunction) => {
    console.log(
      'Received message:',
      message,
      'from sender:',
      sender,
      'with response:',
      sendResponse,
    )
  },
)
