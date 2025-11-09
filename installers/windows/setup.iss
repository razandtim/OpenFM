; OpenFM Windows Installer Script (Inno Setup)

#define AppName "OpenFM"
#define AppVersion "0.1.0"
#define AppPublisher "OpenFM Team"
#define AppURL "https://github.com/openfm/openfm"
#define AppExeName "openfm-desktop.exe"

[Setup]
AppId={{8B3D4F2A-9C7E-4B1D-8F6A-3E9C2A1B5D4F}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppURL}
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
OutputDir=..\..\dist
OutputBaseFilename=OpenFM-Setup-x64
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "installmoodpacks"; Description: "Install Starter Mood Packs (Epic, Romantic, Funny, Scary, Sad)"; GroupDescription: "Content:"; Flags: checkedonce

[Files]
; Service
Source: "..\..\apps\service\dist\*"; DestDir: "{app}\service"; Flags: ignoreversion recursesubdirs

; Desktop app executable
Source: "..\..\apps\desktop\src-tauri\target\release\{#AppExeName}"; DestDir: "{app}"; Flags: ignoreversion

; Desktop app dependencies (if any)
Source: "..\..\apps\desktop\src-tauri\target\release\*.dll"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist

; OBS Plugin
Source: "..\..\apps\obs-plugin\build\Release\openfm.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion; Check: CheckOBSInstalled

; OBS Plugin Qt Dependencies (copy from OBS installation if available)
; Note: These will be copied from OBS's bin directory to ensure version compatibility
Source: "{code:GetOBSBinDir}\Qt6Core.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion external; Check: CheckOBSInstalled and FileExists(ExpandConstant('{code:GetOBSBinDir}\Qt6Core.dll'))
Source: "{code:GetOBSBinDir}\Qt6Widgets.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion external; Check: CheckOBSInstalled and FileExists(ExpandConstant('{code:GetOBSBinDir}\Qt6Widgets.dll'))
Source: "{code:GetOBSBinDir}\Qt6WebEngineWidgets.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion external; Check: CheckOBSInstalled and FileExists(ExpandConstant('{code:GetOBSBinDir}\Qt6WebEngineWidgets.dll'))
Source: "{code:GetOBSBinDir}\Qt6WebEngineCore.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion external; Check: CheckOBSInstalled and FileExists(ExpandConstant('{code:GetOBSBinDir}\Qt6WebEngineCore.dll'))
Source: "{code:GetOBSBinDir}\Qt6WebChannel.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion external; Check: CheckOBSInstalled and FileExists(ExpandConstant('{code:GetOBSBinDir}\Qt6WebChannel.dll'))
Source: "{code:GetOBSBinDir}\Qt6Network.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion external; Check: CheckOBSInstalled and FileExists(ExpandConstant('{code:GetOBSBinDir}\Qt6Network.dll'))
Source: "{code:GetOBSBinDir}\Qt6Gui.dll"; DestDir: "{code:GetOBSPluginDir}"; Flags: ignoreversion external; Check: CheckOBSInstalled and FileExists(ExpandConstant('{code:GetOBSBinDir}\Qt6Gui.dll'))

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExeName}"
Name: "{group}\{cm:UninstallProgram,{#AppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\service\index.js"; Parameters: "--install-starter-packs"; Flags: runhidden; Tasks: installmoodpacks; StatusMsg: "Installing Starter Mood Packs..."
Filename: "{app}\{#AppExeName}"; Description: "{cm:LaunchProgram,{#AppName}}"; Flags: nowait postinstall skipifsilent

[Code]
function GetOBSPluginDir(Param: String): String;
var
  OBSPath: String;
begin
  if RegQueryStringValue(HKLM, 'SOFTWARE\OBS Studio', 'InstallPath', OBSPath) then
    Result := OBSPath + '\obs-plugins\64bit'
  else if RegQueryStringValue(HKCU, 'SOFTWARE\OBS Studio', 'InstallPath', OBSPath) then
    Result := OBSPath + '\obs-plugins\64bit'
  else
    Result := ExpandConstant('{commonpf}\obs-studio\obs-plugins\64bit');
end;

function GetOBSBinDir(Param: String): String;
var
  OBSPath: String;
begin
  if RegQueryStringValue(HKLM, 'SOFTWARE\OBS Studio', 'InstallPath', OBSPath) then
    Result := OBSPath + '\bin\64bit'
  else if RegQueryStringValue(HKCU, 'SOFTWARE\OBS Studio', 'InstallPath', OBSPath) then
    Result := OBSPath + '\bin\64bit'
  else
    Result := ExpandConstant('{commonpf}\obs-studio\bin\64bit');
end;

function CheckOBSInstalled(): Boolean;
var
  OBSPath: String;
begin
  Result := RegQueryStringValue(HKLM, 'SOFTWARE\OBS Studio', 'InstallPath', OBSPath) or
            RegQueryStringValue(HKCU, 'SOFTWARE\OBS Studio', 'InstallPath', OBSPath) or
            DirExists(ExpandConstant('{commonpf}\obs-studio'));
end;

