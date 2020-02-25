function autocomplete(inp, arr, list_to_append, form_to_fill) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                
                var node = document.createElement("tr");
                node.setAttribute("id", inp.value);
                
                var text_cell = document.createElement("td");
                text_cell.setAttribute("scope", "row");
                node.appendChild(text_cell);
                
                var textnode = document.createTextNode(inp.value);
                text_cell.appendChild(textnode);
                /*text_cell.innerHTML = textnode;*/
                
                var del_btn = document.createElement("input");
  
                del_btn.setAttribute("class", "btn btn-danger btn-sm");
                del_btn.setAttribute("type", "button");
                del_btn.setAttribute("id", inp.value);
                del_btn.setAttribute("value", "Remove");
                
                del_btn.addEventListener('click', function(){ remove_item(del_btn.id, form_to_fill); });
                
                var btn_cell = document.createElement("td");
                
                node.appendChild(btn_cell);
                btn_cell.appendChild(del_btn);
                document.getElementById(list_to_append).appendChild(node);
                
                var existing_text = document.getElementById(form_to_fill).value
                var new_text = existing_text.concat(inp.value,",");
                document.getElementById(form_to_fill).value = new_text;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
                inp.value = "";
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  
  function remove_item(item, form_to_fill) {
      var element = document.getElementById(item);
      element.parentNode.removeChild(element);
      
      var form = document.getElementById(form_to_fill).value;
      var data_to_be_deleted = item.concat(",");
      var updated_data = form.replace(data_to_be_deleted, "");
      document.getElementById(form_to_fill).value = updated_data;
      
      
  }
  
  function clear_form(form1, form2){
      document.getElementById(form1).value = "";
      document.getElementById(form2).value = "";
  }
  
  function fill_serial(serial_number){
      document.getElementById("serial_number").value = serial_number;
  }
  
  /*An array containing all mitre impact values:*/
  var impacts = [
  "Automated Exfiltration",
  "Data Compressed",
  "Data Encrypted",
  "Data Transfer Size Limits",
  "Exfiltration over Alternative Protocol",
  "Exfiltration Over Command and Control Channel",
  "Exfiltration Over Other Network Medium",
  "Exfiltration Over Physical Medium",
  "Scheduled Transfer",
  "Data Encrypted for Impact",
  "Data Destruction",
  "Defacement",
  "Disk Content Wipe",
  "Disk Structure Wipe",
  "Endpoint Denial of Service",
  "Firmware Corruption",
  "Inhibit System Recovery",
  "Network Denial of Service",
  "Resource Hijacking",
  "Runtime Data Manipulation",
  "Service Stop",
  "Stored Data Manipulation",
  "Transmitted Data Manipulation"];
  
  /*An array containing all the mitre attack values:*/
  var key_capabillities = [".bash_profile and .bashrc",
  "Access Token Manipulation",
  "Accessibility Features",
  "Account Discovery",
  "Account Manipulation",
  "AppCert DLLs",
  "AppInit DLLs",
  "AppleScript",
  "Application Deployment Software",
  "Application Shimming",
  "Application Window Discovery",
  "Audio Capture",
  "Authentication Package",
  "Automated Collection",
  "Automated Exfiltration",
  "BITS Jobs",
  "Bash History",
  "Binary Padding",
  "Bootkit    Exploitation for Privilege Escalation",
  "Browser Bookmark Discovery",
  "Browser Extensions",
  "Brute Force",
  "Bypass User Account Control",
  "CMSTP",
  "Change Default File Association",
  "Clear Command History",
  "Clipboard Data Connection Proxy",
  "Code Signing",
  "Command-Line Interface",
  "Commonly Used Port",
  "Communication Through Removable Media",
  "Compiled HTML File",
  "Component Firmware",
  "Component Object Model Hijacking",
  "Control Panel Items",
  "Create Account",
  "Credential Dumping",
  "Credentials in Files",
  "Credentials in Registry    Network Service Scanning",
  "Custom Command and Control Protocol",
  "Custom Cryptographic Protocol",
  "DCShadow",
  "DLL Search Order Hijacking",
  "DLL Side-Loading",
  "Data Compressed    Data Encrypted for Impact",
  "Data Destruction",
  "Data Encoding",
  "Data Encrypted Defacement",
  "Data Obfuscation",
  "Data Transfer Size Limits",
  "Data from Local System",
  "Data from Network Shared Drive",
  "Deobfuscate/Decode Files or Information",
  "Disabling Security Tools",
  "Disk Content Wipe",
  "Disk Structure Wipe",
  "Distributed Component Object Model",
  "Domain Fronting    Exfiltration Over Physical Medium",
  "Domain Generation Algorithms",
  "Domain Trust Discovery",
  "Drive-by Compromise",
  "Dylib Hijacking    Compile After Delivery  Forced Authentication",
  "Dylib Hijacking    Path Interception",
  "Dynamic Data Exchange",
  "Email Collection",
  "Endpoint Denial of Service",
  "Execution Guardrails",
  "Execution through API",
  "Execution through Module Load",
  "Exfiltration Over Alternative Protocol",
  "Exfiltration Over Command and Control Channel",
  "Exfiltration Over Other Network Medium Firmware Corruption",
  "Exploit Public-Facing Application",
  "Exploitation for Credential Access",
  "Exploitation for Defense Evasion",
  "Exploitation of Remote Services    Data from Information Repositories",
  "External Remote Services",
  "Extra Window Memory Injection",
  "Fallback Channels",
  "File Deletion",
  "File Permissions Modification",
  "File System Logical Offsets",
  "File System Permissions Weakness",
  "File and Directory Discovery",
  "Gatekeeper Bypass",
  "Graphical User Interface",
  "Group Policy Modification",
  "HISTCONTROL",
  "Hardware Additions",
  "Hidden Files and Directories",
  "Hidden Users",
  "Hidden Window",
  "Hooking    Control Panel Items",
  "Hooking    Password Policy Discovery",
  "Hooking    Scheduled Task",
  "Hypervisor",
  "Image File Execution Options Injection",
  "Indicator Blocking",
  "Indicator Removal from Tools",
  "Indicator Removal on Host",
  "Indirect Command Execution",
  "Inhibit System Recovery",
  "Input Capture",
  "Input Prompt",
  "Install Root Certificate",
  "InstallUtil",
  "Kerberoasting",
  "Kernel Modules and Extensions",
  "Keychain",
  "LC_LOAD_DYLIB Addition",
  "LC_MAIN Hijacking",
  "LLMNR/NBT-NS Poisoning and Relay",
  "LSASS Driver",
  "Launch Agent",
  "Launch Daemon",
  "Launchctl",
  "Local Job Scheduling",
  "Login Item",
  "Logon Scripts",
  "Man in the Browser",
  "Masquerading",
  "Modify Existing Service",
  "Modify Registry",
  "Mshta",
  "Multi-Stage Channels",
  "Multi-hop Proxy",
  "Multiband Communication",
  "Multilayer Encryption",
  "NTFS File Attributes",
  "Netsh Helper DLL",
  "Network Denial of Service",
  "Network Share Connection Removal",
  "Network Share Discovery    Pass the Ticket Data from Removable Media",
  "Network Sniffing",
  "New Service",
  "Obfuscated Files or Information",
  "Office Application Startup",
  "Pass the Hash",
  "Password Filter DLL",
  "Path Interception",
  "Peripheral Device Discovery",
  "Permission Groups Discovery",
  "Plist Modification",
  "Port Knocking",
  "Port Monitors",
  "PowerShell",
  "Private Keys",
  "Process Discovery",
  "Process Doppelgänging",
  "Process Hollowing",
  "Process Injection",
  "Query Registry",
  "Rc.common",
  "Re-opened Applications",
  "Redundant Access",
  "Registry Run Keys / Startup Folder",
  "Regsvcs/Regasm",
  "Regsvr32",
  "Remote Access Tools",
  "Remote Desktop Protocol    Data Staged",
  "Remote File Copy",
  "Remote Services    Input Capture",
  "Remote System Discovery    Taint Shared Content",
  "Replication Through Removable Media",
  "Resource Hijacking",
  "Rootkit",
  "Rundll32",
  "Runtime Data Manipulation",
  "SID-History Injection",
  "SIP and Trust Provider Hijacking",
  "SSH Hijacking",
  "Scheduled Task",
  "Scheduled Transfer",
  "Screen Capture",
  "Screensaver",
  "Scripting",
  "Security Software Discovery",
  "Security Support Provider",
  "Securityd Memory",
  "Service Execution",
  "Service Registry Permissions Weakness",
  "Service Stop",
  "Setuid and Setgid",
  "Shared Webroot",
  "Shortcut Modification",
  "Signed Binary Proxy Execution",
  "Signed Script Proxy Execution",
  "Software Packing",
  "Source Launch Daemon",
  "Space after Filename",
  "Spearphishing Attachment",
  "Spearphishing Link",
  "Spearphishing via Service",
  "Standard Application Layer Protocol",
  "Standard Cryptographic Protocol",
  "Standard Non-Application Layer Protocol",
  "Startup Items",
  "Stored Data Manipulation",
  "Sudo",
  "Sudo Caching",
  "Supply Chain Compromise    Exploitation for Client Execution",
  "System Firmware",
  "System Information Discovery",
  "System Network Configuration Discovery",
  "System Network Connections Discovery",
  "System Owner/User Discovery",
  "System Service Discovery",
  "System Time Discovery",
  "Systemd Service",
  "Template Injection",
  "Third-party Software",
  "Time Providers",
  "Timestomp",
  "Transmitted Data Manipulation",
  "Trap",
  "Trusted Developer Utilities",
  "Trusted Relationship",
  "Two-Factor Authentication Interception",
  "Uncommonly Used Port",
  "User Execution",
  "Valid Accounts",
  "Valid Accounts InstallUtil",
  "Video Capture",
  "Virtualization/Sandbox Evasion",
  "Web Service",
  "Web Shell",
  "Windows Admin Shares",
  "Windows Management Instrumentation",
  "Windows Management Instrumentation Event Subscription",
  "Windows Remote Management",
  "Winlogon Helper DLL",
  "XSL Script Processing"];
  
  clear_form("impact", "key_capabillities");
  /*initiate the autocomplete function on the "myInput" element, and pass along the impacts array as possible autocomplete values:*/
  autocomplete(document.getElementById("myInput"), impacts, "impactList", "impact");
  autocomplete(document.getElementById("key_capabillities_input"), key_capabillities, "capabillityList", "key_capabillities");