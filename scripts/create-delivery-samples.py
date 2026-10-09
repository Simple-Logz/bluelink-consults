from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("Body", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("BodyBold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
root=Path(__file__).resolve().parents[1]
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BrandTitle',fontName='BodyBold',fontSize=25,leading=29,textColor=HexColor('#102c46'),spaceAfter=18))
styles.add(ParagraphStyle(name='SectionTitle',fontName='BodyBold',fontSize=15,leading=19,textColor=HexColor('#a52d43'),spaceBefore=18,spaceAfter=9))
styles.add(ParagraphStyle(name='Copy',fontName='Body',fontSize=10,leading=15,spaceAfter=10,textColor=HexColor('#25384b')))
styles.add(ParagraphStyle(name='Cell',fontName='Body',fontSize=9,leading=13,textColor=HexColor('#25384b')))
def p(t):return Paragraph(t,styles['Copy'])
def table(rows,widths):
 t=Table([[Paragraph(str(c),styles['Cell']) for c in row] for row in rows],colWidths=widths,repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#eef3f9')),('GRID',(0,0),(-1,-1),.5,HexColor('#e4bcc5')),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10)]));return t
def header(canvas,doc):
 canvas.setFillColor(HexColor('#102c46'));canvas.setFont('BodyBold',12);canvas.drawString(48,797,'BlueLink Consults')
 canvas.setStrokeColor(HexColor('#a52d43'));canvas.line(48,785,547,785)
 canvas.setFont('Body',8);canvas.setFillColor(HexColor('#52657a'));canvas.drawString(48,32,'ILLUSTRATIVE SAMPLE | Fictional information | Not a client result');canvas.drawRightString(547,32,f'{doc.page}')
def build(file,title,sections):
 story=[Paragraph(title,styles['BrandTitle']),p('Version 1.0 | 9 October 2026'),p('This document illustrates an engagement deliverable. All organizations, systems and findings below are fictional. Adapt the scope, criteria and evidence requirements with the client before use.')]
 for heading,content in sections:
  if heading=='PAGE':story.append(PageBreak());continue
  story.append(Paragraph(heading,styles['SectionTitle']))
  story.extend(content)
 SimpleDocTemplate(str(root/'public/resources'/file),pagesize=(595,842),rightMargin=48,leftMargin=48,topMargin=78,bottomMargin=56).build(story,onFirstPage=header,onLaterPages=header)
build('technology-assessment-sample.pdf','Technology Assessment\nSample Report',[
 ('Engagement scope',[p('Example institution: Example Payment Services Ltd. System: payment API, transaction database and release pipeline. Review boundary: infrastructure configuration, backup recovery, access control and release evidence. Legal compliance certification is outside this sample scope.')]),
 ('Evidence register',[table([['ID','Evidence requested','Owner / status'],['EV-01','System inventory and dependency map','Application owner / requested'],['EV-02','Backup configuration and recent restore results','Operations / received'],['EV-03','Production access list and approval trail','Security / requested'],['EV-04','Release pipeline configuration and validation logs','Engineering / received']],[60,285,154])]),
 ('Rating method',[p('High: potential material service interruption or exposure requiring prompt treatment. Medium: control weakness that needs planned remediation. Low: improvement with limited immediate impact. Unverified: evidence is insufficient; do not mark the control effective.')]),
 ('PAGE',[]),
 ('Illustrative findings',[table([['ID / priority','Finding and evidence','Recommended action'],['F-01 / High','Restore evidence supplied does not include a successful end-to-end application recovery.','Run a representative restore, record recovery timings and reconcile transactions.'],['F-02 / Medium','A shared production account appears in the supplied access list. Ownership is unverified.','Confirm its use, assign accountable ownership and replace shared interactive access where appropriate.'],['F-03 / Medium','Release logs do not include a rollback rehearsal.','Define rollback criteria and rehearse the approved procedure in staging.']],[82,220,197])]),
 ('Action and acceptance register',[table([['Action','Owner / target date','Acceptance evidence'],['A-01 Restore exercise','Operations owner / agree date','Successful restore log and agreed recovery timings'],['A-02 Access review','Security owner / agree date','Approved access register and removed unnecessary permissions'],['A-03 Rollback rehearsal','Release owner / agree date','Rehearsal record and reviewed cutover runbook']],[167,147,185])]),
 ('Review and sign-off',[p('Reviewer: ____________________ Date: __________<br/>Client decision owner: ____________________ Date: __________<br/>Outstanding evidence and agreed exceptions: __________________________________')])])
build('migration-planning-template.pdf','Migration Planning\nWorking Template',[
 ('1. Define the migration',[table([['Planning field','Complete with the client'],['Business objective / sponsor','________________________________________'],['Systems and data in scope','________________________________________'],['Source / target locations','________________________________________'],['Recovery time / recovery point objectives','________________________________________'],['Maintenance window / decision owner','________________________________________']],[220,279])]),
 ('2. Map dependencies',[p('Record databases, object storage, queues, API integrations, secrets, certificates, identity providers, scheduled jobs, monitoring and backups. For each dependency, name its owner, location and required change.')]),
 ('3. Set the acceptance gates',[p('Agree data reconciliation checks, performance thresholds, security controls, restore tests and sign-off requirements. Confirm which checks must pass and who may approve exceptions.')]),
 ('PAGE',[]),
 ('4. Cutover runbook',[table([['Sequence','Activity','Owner / evidence'],['1','Confirm go/no-go criteria and communication','Decision owner / approved checklist'],['2','Take verified recovery point; prepare synchronization','Database owner / backup and replication logs'],['3','Apply the agreed write-control and final synchronization','Application owner / synchronization result'],['4','Switch traffic and run smoke and reconciliation checks','Release owner / checks and transaction totals'],['5','Monitor service health and decide acceptance or rollback','Operations / metrics and decision record']],[80,235,184])]),
 ('5. Rollback conditions',[p('Stop if: ______________________________<br/>Authority to invoke rollback: ______________________________<br/>Steps to restore traffic and preserve transaction consistency: ______________________________<br/>Maximum allowed cutover duration: ______________________________')]),
 ('6. Stabilization and handover',[p('Define the observation period, alert thresholds, escalation contacts, retained evidence and responsibility for source-environment retirement. Do not delete source data until retention obligations and acceptance conditions are confirmed.')]),
 ('Approval record',[p('Technical lead: ____________________ Compliance reviewer: ____________________<br/>Business owner: ____________________ Approved window: ____________________')])])
build('release-validation-sample.pdf','Release Validation\nSample Evidence Record',[
 ('Release identification',[p('Example release: Payments API v2.4 (fictional). Environment: staging. Candidate version / commit: record exact identifier. Target release date: agree with the decision owner. Overall recommendation: HOLD pending the failed recovery check below.')]),
 ('Agreed checks',[table([['Check','Acceptance criterion','Illustrative result'],['Configuration','Required settings and secrets present; no test credentials','PASS / EV-C01'],['Integration','Critical payment and reconciliation paths complete','PASS / EV-I01'],['Performance','Agreed throughput and latency threshold sustained','NOT RUN / threshold not agreed'],['Recovery','Restore and rollback rehearsal meet agreed objectives','FAIL / recovery rehearsal incomplete']],[110,270,119])]),
 ('Evidence requirements',[p('For every check, retain execution date, environment, candidate version, test method, result and evidence reference. A result without retrievable evidence remains unverified.')]),
 ('PAGE',[]),
 ('Exception and remediation register',[table([['Issue','Impact / action','Owner / due date'],['EX-01 Recovery check incomplete','Release cannot be recommended until the agreed recovery rehearsal is recorded.','Operations owner / agree date'],['EX-02 Performance criterion missing','Agree representative load and measurable thresholds; execute the test.','Engineering and business owner / agree date']],[155,215,129])]),
 ('Release decision',[p('Decision: [ ] Approve [ ] Approve with documented exceptions [ ] Hold<br/>Decision owner: ____________________ Date/time: ____________________<br/>Accepted exceptions and rationale: __________________________________<br/>Required follow-up and owner: __________________________________')]),
 ('Operating readiness',[p('Confirm monitoring, escalation contacts, runbooks, rollback access and recovery points before approving production release. Validation evidence supports the decision; it does not replace the accountable release owner.')]),
 ('Handover record',[p('Runbook location: ____________________ Support owner: ____________________<br/>Escalation contact: ____________________ Acceptance record: ____________________')])])
