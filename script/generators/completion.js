import { saveReport } from '../utils/localstorage.js';

export function generateCompletionBBCode() {
  const getValue = id => document.getElementById(id)?.value || "";

  const probationerName = getValue("completionProbationer");
  const probationerSerial = getValue("completionProbationerSerial");
  const completionDate = getValue("completionDate");
  
  const ftpManagerName = getValue("completionFTPManager");
  const ftpManagerSerial = getValue("completionFTPManagerSerial");
  const ftpManagerDate = getValue("completionFTPManagerDate");
  
  const ftpSACName = getValue("completionFTPSAC");
  const ftpSACSerial = getValue("completionFTPSACSerial");
  const ftpSACDate = getValue("completionFTPSACDate");
  
  const ftpCoordinatorName = getValue("completionFTPCoordinator");
  const ftpCoordinatorSerial = getValue("completionFTPCoordinatorSerial");
  const ftpCoordinatorDate = getValue("completionFTPCoordinatorDate");

  let bbcode = "";
  bbcode += "[font=Times New Roman][color=black]Page [u]1[/u] of [u]1[/u][/color][/font]\n";
  bbcode += "[hr][/hr]\n";
  bbcode += "[font=Times New Roman][center][size=150][color=black][b]FIELD TRAINING PROGRAM\n";
  bbcode += "COMPLETION RECORD[/b][/font][/color][/size][/center]\n\n";

  // Probationer Info Row
  bbcode += "[table2=1,transparent,transparent,Times New Roman]\n";
  bbcode += "[tr]\n";
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${probationerName}[/u]\n`;
  bbcode += `[b]Probationer's Name[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${probationerSerial}[/u]\n`;
  bbcode += `[b]Serial No.[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${completionDate}[/u]\n`;
  bbcode += `[b]Date of Completion[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += "[/tr]\n";
  bbcode += "[/table2]\n";

  // Certification text
  bbcode += `[font=Times New Roman][size=120]\n`;
  bbcode += `I certify that Officer [u]${probationerName}[/u] has received the basic instruction as outlined in the Field Training Overview and that the officer understands and has satisfactorily performed in all of the functional areas or categories. The officer has successfully completed his/her probationary period and is now prepared to advance to Police Officer II.[/size][/font]\n\n`;

  // FTP Manager Row
  bbcode += "[table2=1,transparent,transparent,Times New Roman]\n";
  bbcode += "[tr]\n";
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpManagerName}[/u]\n`;
  bbcode += `[b]Signature of FTP Manager[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpManagerSerial}[/u]\n`;
  bbcode += `[b]Serial No.[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpManagerDate}[/u]\n`;
  bbcode += `[b]Date[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += "[/tr]\n";
  bbcode += "[/table2]\n\n";

  // FTP SAC Row
  bbcode += "[table2=1,transparent,transparent,Times New Roman]\n";
  bbcode += "[tr]\n";
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpSACName}[/u]\n`;
  bbcode += `[b]Signature of FTP SAC[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpSACSerial}[/u]\n`;
  bbcode += `[b]Serial No.[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpSACDate}[/u]\n`;
  bbcode += `[b]Date[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += "[/tr]\n";
  bbcode += "[/table2]\n\n";

  bbcode += "[hr][/hr]\n";
  bbcode += `[font=Times New Roman][size=120]\n`;
  bbcode += `I attest that the above named probationer has satisfactorily completed the Field Training Program.[/size][/font]\n\n`;

  // FTP Coordinator Row
  bbcode += "[table2=1,transparent,transparent,Times New Roman]\n";
  bbcode += "[tr]\n";
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpCoordinatorName}[/u]\n`;
  bbcode += `[b]Signature of FTP Coordinator[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpCoordinatorSerial}[/u]\n`;
  bbcode += `[b]Serial No.[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += `[tdwidth=1,transparent,transparent,top,left,30,5][center]\n`;
  bbcode += `[size=120][u]${ftpCoordinatorDate}[/u]\n`;
  bbcode += `[b]Date[/b][/center]\n`;
  bbcode += `[/tdwidth]\n`;
  bbcode += "[/tr]\n";
  bbcode += "[/table2]\n";

  const outputElem = document.getElementById('completionBBCodeOutput');
  outputElem.value = bbcode;
  outputElem.select();

  try {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(bbcode);
    } else {
      document.execCommand("copy");
    }
  } catch (err) {
    console.error("Clipboard copy failed", err);
  }

  // Note: This form doesn't save to the patrol reports since it's SAC-only completion record
}
