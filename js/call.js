var micPermission;

function getLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        micPermission = true;
      })
      .catch((err) => {
        console.error(`SignedCall : Mic Permission Error : ${err}`);
      });
  }
 
getLocalStream();

function calluser(){
    if (SignedCallClient.isEnabled()) {
        window.SignedCallClient.call(receiver, "Getting a call from "+caller.toUpperCase()).then(response => {
            // if the call has been answered
            console.log("call status is: ",response)
            // Show toast notification
            toast.textContent = `Call initiated with ID: ${caller}`;
            toast.classList.add('show');
        }).catch (err => {
            // if the call is either missed or declined 
            // Show toast notification
            toast.textContent = `Call missed or declined with ID: ${receiver}`;
            toast.classList.add('show');
            console.log("call status is: ", err)
        })
    }
}

document.addEventListener('DOMContentLoaded', function() {
            const callButton = document.getElementById('callButton');
            const callModal = document.getElementById('callModal');
            const closeModal = document.getElementById('closeModal');
            const cancelCall = document.getElementById('cancelCall');
            const initiateCall = document.getElementById('initiateCall');
            const callerId = document.getElementById('callerId');
            const receiverId = document.getElementById('receiverId');
            const toast = document.getElementById('toast');

            // Open modal when call button is clicked
            callButton.addEventListener('click', function() {
                callModal.style.display = 'flex';
                callerId.focus(); // Auto focus the input field
            });

            // Close modal functions
            function closeCallModal() {
                callModal.style.display = 'none';
                callerId.value = '';
                receiverId.value = '';
                initiateCall.disabled = true;
            }

            closeModal.addEventListener('click', closeCallModal);
            cancelCall.addEventListener('click', closeCallModal);

            // Close modal when clicking outside
            callModal.addEventListener('click', function(event) {
                if (event.target === callModal) {
                    closeCallModal();
                }
            });

            // Enable/disable call button based on input
            callerId.addEventListener('input', function() {
                initiateCall.disabled = callerId.value.trim() === '';
            });

            receiverId.addEventListener('input', function() {
                initiateCall.disabled = receiverId.value.trim() === '';
            });

            // Handle call initiation
            initiateCall.addEventListener('click', function() {
                const caller = callerId.value.trim();
                const receiver = receiverId.value.trim();
                
                if (micPermission==true) {
                    window.SignedCallSDK.initSignedCall({
                        accountId: "67a9ead27be487e18d1681ed",
                        apikey: "M9eULHgg2CgJP4wJ53jKpCUYQMu14FemJLXH4WLuQvN35u3VRxuUDW8zP8SEZRJV",
                        cuid: caller,
                        clevertap: clevertap,
                        name:caller.toUpperCase()
                        })
                        .then((client) => {
                            console.log("SignedCall Init Successful")
                            console.log({ client })
                            SignedCallClient = client;
                            calluser();
                            
                          })
                        .catch(e => console.log(e));
                      }
                      else{
                        console.log("MiC Permission not ")
                      }

                
                // Close the modal
                closeCallModal();
                
                
                // Hide toast after 3 seconds
                setTimeout(function() {
                    toast.classList.remove('show');
                }, 3000);
                
                console.log(`Initiating call with ID: ${receiver}`);
                // Here you would typically integrate with your actual calling system
            });

            // // Allow Enter key to submit when input is focused
            // callerId.addEventListener('keypress', function(event) {
            //     if (event.key === 'Enter' && callerId.value.trim() !== '') {
            //         initiateCall.click();
            //     }
            // });
        });

