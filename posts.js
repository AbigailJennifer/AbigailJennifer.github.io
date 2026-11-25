/* Add new posts at the TOP of this list. Dates are YYYY-MM-DD (shown as 18 November 2026).
   img: banner image path. toc:false hides the Contents tab. Tags must match research.html slugs. */

/* CB(text, label) makes a copy-paste box for commands, outputs and scripts.
   Write the text exactly as it should be copied; characters like < and > are handled for you. */
function CB(t,label){
 return '<pre class="code" data-label="'+(label||'Code')+'"><code>'+t.replace(/^\n/,'').replace(/\s+$/,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</code></pre>';
}

window.POSTS=[
{id:"symmetry-d2h",img:"images/blog/placeholder.svg",date:"2026-11-25",
 title:"Symmetry Settings in Quantum Chemistry: Making the Most of D2h",
 sub:"What “full symmetry” means, why programs work in D2h, and a uranyl example in OpenMolcas and ORCA",
 tags:["computational-chemistry","openmolcas","orca","actinides","multireference"],toc:true,
 body:
 '<p>Symmetry is one of the most useful tools in electronic structure calculations. Every orbital and state carries a symmetry label, so the results are easier to interpret and you can choose exactly which irrep to target. That control lets you reach a much wider range of electronic transitions than a calculation without symmetry can, and in some cases it also makes the calculation cheaper. This Open Notebook post explains what “full symmetry” means in practice, why programs such as ORCA and OpenMolcas work in D2h rather than in the true point group (D4h, Oh, D∞h …), and where symmetry contributes. The uranyl dication, UO₂²⁺, is used as a worked example in both programs.</p>'+

 '<h2>1. Why bother with symmetry?</h2>'+
 '<ul>'+
 '<li><b>Modest cost savings.</b> Integrals, Fock matrices and CI vectors become block diagonal by irreducible representation (irrep). For SCF and DFT, the gain is usually small, but the CI space of a CASSCF calculation shrinks noticeably when the active space is large.</li>'+
 '<li><b>Stability.</b> Orbitals and states are labelled by irrep, so the SCF/CASSCF cannot wander into a lower-symmetry solution unless you let it.</li>'+
 '<li><b>State control.</b> In multiconfigurational calculations, you can request “the lowest three ³Δg-type states” by choosing the irrep and spin, instead of hoping the right roots come out. Higher states of one irrep are not buried behind lower states of other irreps, so you can reach a wider energy range of the electronic spectrum than a no-symmetry calculation can, which would need many roots and suffers from root flipping and slow convergence.</li>'+
 '<li><b>Interpretation.</b> Orbital and state labels (σu, πg, δu, φu, Ag, B1u …) tell you immediately what an excitation is.</li>'+
 '</ul>'+
 '<p><b>The catch:</b> you must use the symmetry correctly (axis orientation, orbital counts per irrep, one irrep per state), and you must be aware of what the program does with degenerate pairs.</p>'+

 '<h2>2. Why D2h as “full symmetry”, and not D4h, Oh or D∞h?</h2>'+
 '<p>Because the programs can only use <b>abelian</b> point groups (i.e., two operations within the group commute, mathematically AB = BA). The true point group of a molecule (D∞h, D4h, Oh …) usually has degenerate irreps (E, T, Π, Δ …) of dimension two or more. Exploiting them needs non-abelian group theory for the integrals, orbitals and CI vectors. Most wavefunction codes, including ORCA and OpenMolcas, do not implement this (to my knowledge, a few programs, such as AMS-ADF, handle some non-abelian groups).</p>'+
 '<p>The standard solution is to work in the <b>largest abelian subgroup</b> of the true point group. For the molecules discussed here that is almost always <b>D2h</b>: eight operations (E, three C₂ axes, i, three mirror planes) and eight one-dimensional irreps, the biggest block-diagonalisation an abelian group can give:</p>'+
 '<p>Ag, B1g, B2g, B3g, Au, B1u, B2u, B3u.</p>'+
 '<p>Orbitals and states that are degenerate in the true group simply appear as pairs or triples of D2h irreps with identical energies. This is how the common point groups reduce:</p>'+
 '<table>'+
 '<tr><th>True point group</th><th>Uranyl species</th><th>Abelian subgroup used</th><th>Degenerate irreps split as</th></tr>'+
 '<tr><td>D∞h</td><td>UO₂²⁺</td><td>D2h</td><td>Π → B2 + B3, Δ → Ag + B1 (g/u kept)</td></tr>'+
 '<tr><td>D4h</td><td>[UO₂Cl₄]²⁻</td><td>D2h</td><td>Eg → B2g + B3g, Eu → B2u + B3u</td></tr>'+
 '<tr><td>D5h</td><td>[UO₂(H₂O)₅]²⁺</td><td>C2v (or Cs)</td><td>E → two one-dimensional irreps</td></tr>'+
 '</table>'+
 '<p>Two consequences are worth stating up front.</p>'+
 '<ol>'+
 '<li><b>“Full symmetry” means the highest abelian subgroup the program can use, not the true point group.</b> You cannot request D4h or Oh in ORCA or OpenMolcas. You give D2h (or let the program find it), and the higher symmetry survives only as degeneracies in the results.</li>'+
 '<li><b>D4h and Oh contain more than one D2h.</b> In D4h the C₂ axes can pass through the ligands or between them, giving two non-equivalent D2h subgroups with different orbital labels. Decide the orientation first and keep it the same for every state.</li>'+
 '</ol>'+
 '<p>Going lower than D2h (C2h, C2v, Cs, C1) is always possible, at the cost of larger blocks and less control. You do it on purpose when the molecule really has lower symmetry, or when you want to allow symmetry breaking.</p>'+

 '<h3>Correlation D∞h → D2h (molecular axis = z)</h3>'+
 '<table>'+
 '<tr><th>D∞h</th><th>D2h components</th></tr>'+
 '<tr><td>Σg⁺</td><td>Ag</td></tr>'+
 '<tr><td>Σg⁻</td><td>B1g</td></tr>'+
 '<tr><td>Σu⁺</td><td>B1u</td></tr>'+
 '<tr><td>Σu⁻</td><td>Au</td></tr>'+
 '<tr><td>Πg</td><td>B2g + B3g</td></tr>'+
 '<tr><td>Πu</td><td>B2u + B3u</td></tr>'+
 '<tr><td>Δg</td><td>Ag + B1g</td></tr>'+
 '<tr><td>Δu</td><td>Au + B1u</td></tr>'+
 '<tr><td>Φg</td><td>B2g + B3g</td></tr>'+
 '<tr><td>Φu</td><td>B2u + B3u</td></tr>'+
 '</table>'+
 '<p>The axis choice matters: <b>put the O–U–O axis along z</b>. With another orientation the labels in the table change, and so do the orbital counts you feed to the program.</p>'+

 '<h2>3. An example: Uranyl orbitals in D2h</h2>'+
 '<p>UO₂²⁺ is a closed-shell ¹Σg⁺ system (Ag in D2h) with formally U(VI), 5f⁰6d⁰. The valence picture:</p>'+
 '<ul>'+
 '<li><b>Bonding, O 2p-based (12 electrons):</b> σg (Ag), σu (B1u), πg (B2g + B3g), πu (B2u + B3u). Six orbitals, twelve electrons.</li>'+
 '<li><b>Non-bonding U 5f:</b> δu (B1u + Au) and φu (B2u + B3u). These form the low-lying virtual space, and the luminescent excited states are σu → 5fδ, 5fφ excitations.</li>'+
 '</ul>'+
 '<p>A convenient active space is therefore <b>CAS(12,10)</b>: the six bonding orbitals plus the four non-bonding 5f orbitals. Distributed over D2h irreps (z = molecular axis) it looks like this:</p>'+
 '<table>'+
 '<tr><th>Irrep</th><th>Ag</th><th>B1g</th><th>B2g</th><th>B3g</th><th>Au</th><th>B1u</th><th>B2u</th><th>B3u</th></tr>'+
 '<tr><td>Active orbitals</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td></tr>'+
 '</table>'+
 '<p>The orbitals are: Ag = σg; B1u = σu and 5fδ; Au = 5fδ; B2g, B3g = πg; B2u, B3u = πu and 5fφ.</p>'+
 '<p>Similarly, the excited states follow from irrep products. σu (B1u) → 5fδ (B1u, Au) gives Ag and B1g, which are the two components of Δg; σu → 5fφ (B3u, B2u) gives B2g and B3g, the two components of Φg. So if you want the lowest ³Δg and ³Φg states you run four irreps (Ag, B1g, B2g, B3g) at triplet spin. These four are all gerade, so they are dipole forbidden from the Ag ground state, which is why uranyl luminescence is weak and long-lived. The bright, dipole-allowed states are the ungerade ones (B1u, B2u, B3u), which lie higher in energy.</p>'+
 '<p><b>Symmetry is also a trap if used blindly.</b> A molecule with a degenerate ground state (Jahn–Teller or Renner–Teller cases) forced into a high-symmetry subgroup converges to a saddle point or an averaged state. For such cases lower the symmetry and compare.</p>'+
 '<p>With that background, the rest of this post follows one concrete example in detail: the uranyl dication, UO₂²⁺.</p>'+

 '<h2>4. OpenMolcas</h2>'+
 '<p>OpenMolcas makes symmetry very explicit, which is both its strength and the main source of user error.</p>'+
 '<h3>Geometry</h3>'+
 '<p>Use a linear geometry along z (the U=O distance of about 1.70 Å is typical for the free ion; use your optimised value):</p>'+
 CB(`3
UO2(2+)
U   0.000000   0.000000   0.000000
O   0.000000   0.000000   1.700000
O   0.000000   0.000000  -1.700000`,'XYZ file')+
 '<p>Save this as <code>uo2.xyz</code>.</p>'+

 '<h3>Symmetry generators</h3>'+
 '<p>In <code>&amp;GATEWAY</code> you request symmetry through generators. Specifying three reflections, <code>Symmetry = x y z</code>, generates D2h. (<code>Group = Full</code> asks the program to find the highest abelian subgroup itself; I prefer this because it is less explicit.)</p>'+

 '<h3>Irrep ordering in OpenMolcas</h3>'+
 '<p>This is the part that trips people up. OpenMolcas does <b>not</b> list irreps in the textbook order. For D2h the order is:</p>'+
 '<table>'+
 '<tr><th>Index</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>'+
 '<tr><td>Irrep</td><td>Ag</td><td>B3u</td><td>B2u</td><td>B1g</td><td>B1u</td><td>B2g</td><td>B3g</td><td>Au</td></tr>'+
 '</table>'+
 '<p>Every per-irrep list (<code>Occupied</code>, <code>Inactive</code>, <code>Ras2</code>, …) uses this order, and the <code>Symmetry</code> keyword in <code>&amp;RASSCF</code> is the index from this table (Ag = 1, B1g = 4, B2g = 6, B3g = 7).</p>'+

 '<h3>Counting orbitals</h3>'+
 '<p>To fill in <code>Inactive</code> you need the doubly occupied orbitals. Treating U as a Rn-like core plus the O 1s and 2s combinations as inactive, the count per irrep (in textbook order) is:</p>'+
 '<table>'+
 '<tr><th>Irrep</th><th>Ag</th><th>B1g</th><th>B2g</th><th>B3g</th><th>Au</th><th>B1u</th><th>B2u</th><th>B3u</th><th>Total</th></tr>'+
 '<tr><td>Inactive</td><td>14</td><td>3</td><td>3</td><td>3</td><td>1</td><td>9</td><td>7</td><td>7</td><td>47</td></tr>'+
 '</table>'+
 '<p>In OpenMolcas order this is <code>14 7 7 3 9 3 3 1</code>. Adding the six occupied bonding orbitals gives 53 occupied orbitals (106 electrons), distributed as <code>15 8 8 3 10 4 4 1</code> for the SCF <code>Occupied</code> keyword. These numbers assume all semicore shells (5s, 5p, 5d, 4f, 6s, 6p) are kept as inactive orbitals and that the SCF converges to the expected configuration. <b>Always check the orbital irrep occupations printed by <code>&amp;SCF</code> before further calculations;</b> if you freeze core orbitals, adjust accordingly.</p>'+

 '<h3>Input: SCF and ground state CASSCF</h3>'+
 CB(`&GATEWAY
 Coord = uo2.xyz
 Basis = ANO-RCC-VTZP
 Group = Full
 RICD
&SEWARD
 Douglas-Kroll
&SCF
 Charge = 2
 Occupied = 15 8 8 3 10 4 4 1
&RASSCF
 Charge = 2
 Spin = 1
 Symmetry = 1
 Nactel = 12 0 0
 Inactive = 14 7 7 3 9 3 3 1
 Ras2 = 1 2 2 0 2 1 1 1
 CIRoot = 1 1 1`,'OpenMolcas input')+
 '<p>If you use <code>Group = Full</code>, check the output to make sure the program found D2h with the orientation you expect; if it picked a different axis assignment, switch to explicit generators (<code>Symmetry = x y z</code>) and make sure the molecule lies along z.</p>'+

 '<h3>Excited states: one RASSCF per irrep, then RASSI</h3>'+
 '<p>For the lowest triplets of Δg and Φg, run <code>&amp;RASSCF</code> separately for each irrep and combine with <code>&amp;RASSI</code> to include spin-orbit coupling. Schematically, for the B2g component:</p>'+
 CB(`&RASSCF
 Charge = 2
 Spin = 3
 Symmetry = 6
 Nactel = 12 0 0
 Inactive = 14 7 7 3 9 3 3 1
 Ras2 = 1 2 2 0 2 1 1 1
 CIRoot = 2 2 1`,'OpenMolcas input')+
 '<p>Repeat with <code>Symmetry = 1</code> (Ag), <code>4</code> (B1g) and <code>7</code> (B3g). Save the <code>JobIph</code> files under distinct names and feed them to <code>&amp;RASSI</code> with <code>SpinOrbit</code>, adding the SO-CASSCF ground-state <code>JobIph</code>. Since orbitals are optimised separately for each irrep and root set, RASSI will handle the non-orthogonality.</p>'+

 '<h2>5. ORCA</h2>'+
 '<p>ORCA also detects the point group and uses the abelian subgroup, but it is far more automatic and gives you less direct control than OpenMolcas. Unlike OpenMolcas, ORCA follows the textbook (Mulliken) order for D2h: Ag, B1g, B2g, B3g, Au, B1u, B2u, B3u. The irrep index in the <code>%casscf</code> block counts from 0 for Ag in ORCA v6.1. The syntax below is a template. <b>Check the symmetry and CASSCF sections of the manual for your ORCA version,</b> since the details have changed between releases.</p>'+
 CB(`! DKH2 UseSym TightSCF
%basis
  NewGTO U "SARC-DKH-TZVP" end
  NewGTO O "DKH-def2-TZVP" end
end
%casscf
  nel    12
  norb   10
  irrep  0   # totally symmetric (Ag), required with UseSym
  mult   1
  nroots 1
end
* xyz 2 1
U   0.000000   0.000000   0.000000
O   0.000000   0.000000   1.700000
O   0.000000   0.000000  -1.700000
*`,'ORCA input')+
 '<p>A few things are worth knowing in ORCA. Symmetry is switched on with the <code>UseSym</code> keyword (also available as <code>UseSym true</code> in the <code>%method</code> block), and the point group detection tolerance can be loosened with <code>SymThresh</code> if your coordinates have small numerical noise. ORCA may reorient the molecule into a standard frame, so check the printed orientation and the irrep labels of the orbitals before you interpret them in terms of σ, π, δ and φ. Active space selection is orbital-based rather than irrep-count-based: unlike OpenMolcas, you do not give “1 2 2 0 2 1 1 1”, but instead run an SCF, inspect the orbital energies and irreps, and pick the six bonding and four 5f orbitals by reordering them (for example with the <code>Rotate</code> option or a prepared orbital file with <code>MOInp</code>). CASSCF can then be run for a specific irrep and multiplicity using the <code>irrep</code> setting in the <code>%casscf</code> block. Spin–orbit coupling is handled afterwards, for instance through QDPT on top of the CASSCF states, so keep the state manifold for every irrep consistent.</p>'+

 '<h2>6. In short</h2>'+
 '<ul>'+
 '<li>D2h is the abelian subgroup that lets programs exploit the symmetry of linear (D∞h) and many high-symmetry molecules.</li>'+
 '<li>For uranyl, put the O–U–O axis on z and describe the valence space as σg, σu, πg, πu plus the 5fδ and 5fφ orbitals.</li>'+
 '<li>In OpenMolcas, you specify orbitals per irrep, in the order Ag, B3u, B2u, B1g, B1u, B2g, B3g, Au. Combine individual irreps through <code>RASSI</code>, along with SOC.</li>'+
 '<li>In ORCA, symmetry is more automatic, so verify the detected orientation and select the active orbitals by inspection. Irreps are combined by mentioning them as integers separated by a comma, along with respective multiplicities.</li>'+
 '<li>Treat each state irrep separately, then combine with spin-orbit coupling.</li>'+
 '</ul>'+
 '<p><b>Note:</b> the orbital counts and input syntax are illustrative. Check them against your SCF output and the manual of your program version before running calculations.</p>'},

{id:"welcome",img:"images/blog/welcome.png",date:"2026-11-04",
 title:"Welcome to my Open Notebook: Why this Blog Exists",
 sub:"A home for my inputs, outputs, their interpretations and general discussions",
 tags:[],toc:false,
 body:'<p>Welcome. This page keeps my work in one place: the calculations I run, the inputs I write, the outputs and spectra that come out of them, and the notes I make along the way.</p>'+
 '<h2>Why I made it</h2><p>Research on heavy elements involves many small decisions that rarely reach a paper: which active space I tried, why a calculation did not converge, how a spectrum was broadened. Writing these down helps me repeat my own work and, I hope, helps students who are starting on similar problems.</p><p>This space will also hold tutorials on the software I use, written from my own experience with OpenMolcas, ORCA and NWChem. Manuals explain what each keyword does, but they rarely show how the keywords fit together for a real problem, so I will try to fill that gap with working examples. Alongside these, there will be general discussions on choosing methods and interpreting results.</p>'+
 '<h2>What you will find here</h2><ul><li><b>Inputs:</b> annotated examples of how a calculation is set up.</li><li><b>Outputs:</b> results, spectra and the plots made from them.</li><li><b>Notes:</b> what worked, what failed and what I would do differently.</li></ul><p>Every post carries tags that match the topics on my research page, so a tag there leads you to the related posts here.</p>'+
'<h2>A note on images</h2><p>Most of the images on this blog and on my research page are AI-generated. They are there to illustrate, not to present data. The graphical abstracts that accompany my publications are the exception: I created those from scratch myself.</p>'+
'<h2>A last word</h2><p>I will keep adding posts to this notebook alongside my research, and there is more to come. These are my own working notes, so I would be glad to hear your comments and questions.</p>'},

{id:"cluster-hardware-memory",img:"images/blog/cluster-hardware.png",date:"2026-11-07",
 title:"Understanding Cluster Hardware and Memory Allocations for Calculations on OpenMolcas, NWChem, Gaussian, and ORCA",
 sub:"A beginner-friendly guide to nodes, cores and memory, and how four quantum chemistry programs use them",
 tags:["computational-chemistry","hardware","memory","orca","nwchem","gaussian","openmolcas"],toc:true,
 body:
 '<p>The first time I submitted a calculation to a cluster, I had no idea what “nodes,” “cores,” or “memory per CPU” really meant. I copied a job script from a senior colleague, changed the input file, and hoped for the best. Sometimes it ran. Sometimes it died with a cryptic out-of-memory message after two days in the queue. If that sounds familiar, this post is for you.</p>'+
 '<p>We will start from the very basics of cluster hardware, then look at how four popular quantum chemistry programs (OpenMolcas, NWChem, Gaussian and ORCA) each treat processors and memory, and finally put together some rules of thumb for choosing memory.</p>'+

 '<h2>1. What is a computing cluster?</h2>'+
 '<p>Instead of one computer on your desk, a computing cluster is access to dozens or hundreds of machines, each far more capable than a laptop. A single DFT or multireference calculation on a heavy-element complex can need hundreds of gigabytes of memory and days of computing time on a laptop, which typically has 8 to 16 GB of memory, while a cluster lets you borrow a large machine with more memory for such large computations.</p>'+
 '<p>A cluster has 4 parts:</p>'+
 '<ol type="a">'+
 '<li><b>Login node:</b> the machine you connect to (usually through SSH). It is used to edit files, prepare inputs, and submit jobs. Never run heavy calculations here, because every user shares it and one big job slows everyone down.</li>'+
 '<li><b>Scheduler:</b> the job manager (commonly SLURM, PBS or SGE). You submit a job script stating how many cores, how much memory and how much time you need. The scheduler places your job in a queue and starts it when suitable resources are free.</li>'+
 '<li><b>Compute nodes:</b> the machines that actually run your calculation. You normally don’t log in to them directly, the scheduler sends your job there.</li>'+
 '<li><b>Shared storage:</b> your home directory, visible from every node, along with a scratch area for the large temporary files that quantum chemistry programs write.</li>'+
 '</ol>'+

 '<h2>2. The vocabulary: node, processor, core, memory</h2>'+
 '<p>Think of a cluster as a research building.</p>'+
 '<ul>'+
 '<li><b>Node:</b> one complete computer inside the cluster, like one lab in the building. It has its own processors, its own memory, and (usually) its own local disk. A cluster may have tens or hundreds of nodes.</li>'+
 '<li><b>Processor (CPU, or socket):</b> the physical chip. Most compute nodes have two sockets, so two processors per node.</li>'+
 '<li><b>Core:</b> a single processor may contain 16, 32 or 64 cores. Each core can run one calculation task at a time. When people say “I used 16 processors,” they usually mean 16 cores.</li>'+
 '<li><b>Thread:</b> a lighter unit of work that a core can handle. Hyper-threading lets one core appear as two threads. For quantum chemistry, we normally count cores, not threads.</li>'+
 '<li><b>Memory (RAM):</b> the fast working space of the node. It holds the wavefunction, integrals, matrices and everything the program needs right now. It is shared by all cores in that node.</li>'+
 '<li><b>Disk / scratch:</b> slower storage for large temporary files (integrals, checkpoint files, read-write files). Programs use it when memory is not enough.</li>'+
 '</ul>'+
 '<p>The analogy: a node is a lab, cores are the researchers working in it, and memory is the shared bench space. More researchers can work faster, but only if there is enough bench space for all of them, and only if the work can actually be divided.</p>'+

 '<h2>3. Reading your node’s memory: An example</h2>'+
 '<p>Before choosing memory, find out what your compute node actually has. On a SLURM cluster, run:</p>'+
 CB(`sinfo -N -o "%N %X %Y %Z %c %m"`,'Command')+
 '<p>This cluster prints:</p>'+
 CB(`NODELIST SOCKETS CORES THREADS CPUS MEMORY
node1 2 28 1 56 515101
node1 2 28 1 56 515101
node1 2 28 1 56 515101
node1 2 28 1 56 515101
node2 2 28 1 56 515101
node2 2 28 1 56 515101
node2 2 28 1 56 515101
node2 2 28 1 56 515101
node3 2 28 1 56 515101
node3 2 28 1 56 515101
node3 2 28 1 56 515101
node3 2 28 1 56 515101
node4 2 28 1 56 515101
node4 2 28 1 56 515101
node4 2 28 1 56 515101
node4 2 28 1 56 515101
node5 2 56 1 112 1031230
node5 2 56 1 112 1031230
node6 2 56 1 112 1031230
node6 2 56 1 112 1031230
node7 2 56 1 112 1031230
node7 2 56 1 112 1031230
node8 2 56 1 112 1031230
node8 2 56 1 112 1031230
node9 2 56 1 112 1031230
node9 2 56 1 112 1031230
node10 2 56 1 112 1031230
node10 2 56 1 112 1031230
node11 2 56 1 112 1031230
node12 2 56 1 112 1031230`,'Output')+
 '<p><code>SOCKETS</code> is the number of processors in the node. <code>CORES</code> is the number of cores per socket, not the total. <code>THREADS</code> is the number of threads per core. <code>CPUS</code> is the total number of cores in the node (<code>SOCKETS</code> × <code>CORES</code> × <code>THREADS</code>). <code>MEMORY</code> is the memory of the whole node in MB. A node name that appears several times is not several machines: <code>sinfo -N</code> prints one line for every queue (partition) the node belongs to. So there are two kinds of compute nodes here: <code>node1</code> to <code>node4</code> with 56 cores each, and <code>node5</code> to <code>node12</code> with 112 cores each.</p>'+
 '<p><b>How to assign cores.</b> The number of cores you request for a particular job cannot be larger than <code>CPUS</code> of one node (i.e., 56 or 112), and the memory your job can use is (number of cores) × (memory per core), up to the <code>MEMORY</code> of the node (i.e., 503 or 1007 GiB). In the job script, <code>#SBATCH --ntasks=</code> sets the number of cores and <code>#SBATCH --mem=</code> sets the total memory.</p>'+
 '<p><b>How the memory is calculated.</b> The memory per core is the node’s <code>MEMORY</code> divided by its <code>CPUS</code> (a sharing figure). Divide the result by 1024 to convert MB to GiB. On both kinds of nodes here, this works out to about 9 GiB per core.</p>'+
 '<ul>'+
 '<li><code>node1</code> to <code>node4</code>: 515,101 MB (503 GiB) ÷ 56 cores = 9,198 MB (8.98 GiB) per core, so about 9 GiB per core.</li>'+
 '<li><code>node5</code> to <code>node12</code>: 1,031,230 MB (1007 GiB) ÷ 112 cores = 9,207 MB (8.99 GiB) per core, so about 9 GiB per core.</li>'+
 '</ul>'+
 '<p>It is important to note that this 9 GiB (memory) per core is not a limit of the core itself. Memory is attached to the node, not to individual cores (in other words, all cores in a node can read and write all of the node’s RAM). Hence, if your calculation needs more memory than its cores’ share (about 9 GiB per core), you do not need extra cores to get it: ask for the memory directly with <code>--mem</code>. For example, <code>--ntasks=4</code> with <code>--mem=100G</code> gives you 4 cores and 100 GiB, far more than the 36 GiB (4 × 9 GiB) the cores alone would suggest. Just keep the total within the node’s memory (i.e., 503 GiB or 1007 GiB).</p>'+
 '<p><b>NOTE:</b> Memory can be allocated in “total” or “per core” in the script. Ensure the appropriate notation for the program and calculate memory based on it.</p>'+
 '<p>Forgetting this is the most common reason for out-of-memory crashes.</p>'+
 '<p>The login node is a separate machine, with its own memory and disks. To check its memory, run:</p>'+
 CB(`free -h`,'Command')+
 '<p>Here is the output from a node I looked at:</p>'+
 CB(`               total        used        free      shared  buff/cache   available
Mem:           251Gi        10Gi       9.6Gi       2.6Gi       236Gi       241Gi
Swap:           63Gi       2.7Gi        61Gi`,'Output')+
 '<p>The important ones are:</p>'+
 '<ul>'+
 '<li><code>total</code> (251 GiB): the physical RAM installed. This is a “256 GiB” node (the difference is the GB versus GiB unit, i.e., 1 GiB = 1,073,741,824 bytes, whereas GB strictly means 1,000,000,000 bytes, so 1 GiB is about 1.07 GB). A few GiB are reserved by the system itself (for the operating system kernel, firmware, and hardware), which is why 251 is shown and not 256.</li>'+
 '<li><code>available</code> (241 GiB): this is the column that matters. It is the memory you can realistically use for all your jobs.</li>'+
 '</ul>'+
 '<p>On a shared node, remember that other users’ jobs may also be running, so “available” can shrink. On a cluster with a scheduler, you request memory through the job script and the scheduler protects that amount for you.</p>'+
 '<p>A full disk can also stop a job, so check storage too. Memory and disk are different things, and <code>df -h</code> shows the disk.</p>'+
 CB(`df -h`,'Command')+
 '<p>Only a few lines of its output matter:</p>'+
 CB(`Filesystem      Size  Used Avail Use% Mounted on
/dev/sda4       825G  425G  401G  52% /
/dev/sdb1        50T   21T   30T  42% /scratch
/dev/sdb2        22T  4.4T   18T  20% /home`,'Output')+
 '<p>The last column shows where each disk appears. <code>/home</code> holds your inputs and final results, and <code>/scratch</code> is the much larger space for the temporary files programs write while they run. The root disk <code>/</code> belongs to the login node itself, so keep calculations off it. Lines starting with <code>tmpfs</code> live in memory and can be ignored. Some clusters set quotas or clear <code>/scratch</code> automatically, so check the rules before you leave files there.</p>'+
 '<p>How many cores does the login node have? Check with <code>nproc</code> or <code>lscpu</code>. On the same node, <code>lscpu</code> reports:</p>'+
 CB(`Model name:          Intel(R) Xeon(R) Silver 4316 CPU @ 2.30GHz
CPU(s):              40
Thread(s) per core:  1
Core(s) per socket:  20
Socket(s):           2`,'Output')+
 '<p>So 2 sockets × 20 cores per socket = 40 cores. This is the login node, so it’s only for editing and submitting (maybe for very small jobs like plotting or small Python codes for post-calculation processing of output).</p>'+

 '<h2>4. Should I increase memory or cores for effective calculations?</h2>'+
 '<p>These are two separate things depending on the module of the program to consider for every calculation:</p>'+
 '<ul>'+
 '<li>More cores make a calculation faster, but only if the program can split its work among them.</li>'+
 '<li>More memory lets a calculation run without slow use of the disk. Beyond what the calculation needs, extra memory does not make it faster.</li>'+
 '</ul>'+
 '<p>The need for cores and the need for memory are independent. A program may scale beautifully across 64 cores and need little memory (a DFT single point on a small molecule), or it may use only a few cores but demand a huge amount of memory (a large active-space multireference calculation).</p>'+
 '<p><b>Serial:</b> the calculation runs on one core, one step after another. Extra cores are of no use here, so the only thing you can usefully increase is the memory. Many modules of programs such as OpenMolcas run serially unless the program was built and started for parallel use.</p>'+
 '<p><b>Parallel:</b> the calculation is split into pieces that run on several cores at the same time, which is what makes it faster. Programs such as ORCA, NWChem, and Gaussian can run in parallel. The memory can be shared or divided. With shared memory, all cores work on the same data, so you ask for one total for the whole job (Gaussian). With divided memory, each core keeps its own working data, so you ask for an amount per core and the total is that amount × the number of cores (ORCA and NWChem).</p>'+

 '<h2>5. Program by program</h2>'+
 '<h3>ORCA: the well-parallelized one</h3>'+
 '<p>ORCA is built around MPI parallelism and scales well for most of its common workloads: DFT, Hartree-Fock, RI approximations, TD-DFT and coupled-cluster-type methods like DLPNO. Using 16 to 32 cores on a single node is routine, and large jobs can use more.</p>'+
 '<p>You control it with two keywords:</p>'+
 CB(`%pal nprocs 16 end
%maxcore 4000`,'ORCA input')+
 '<ul>'+
 '<li><code>nprocs</code> is the number of cores (MPI processes).</li>'+
 '<li><code>%maxcore</code> is the memory per core, in MB.</li>'+
 '<li>Total memory = <code>nprocs</code> × <code>%maxcore</code> = 16 × 4000 MB = 64 GB.</li>'+
 '</ul>'+
 '<p>One thing to watch: <code>%maxcore</code> is a target, not a hard wall. ORCA can use more than this in some steps. A common recommendation is to set <code>%maxcore</code> to roughly 70 to 80% of the memory available per core and leave the rest as a safety margin. Also, for parallel runs, ORCA must be called with its full path (for example <code>/path/to/orca input.inp &gt; output.out</code>), because it launches MPI internally.</p>'+

 '<h3>OpenMolcas: memory first, parallelism second</h3>'+
 '<p>OpenMolcas does not have parallelism across cores for all its modules. It is a multiconfigurational program, designed for CASSCF, RASSCF, CASPT2, RASSI and related methods. Only certain modules are currently parallel (i.e., <code>gateway</code>, <code>seward</code>, <code>scf</code>, <code>rasscf</code>, <code>caspt2</code>) and within these, the parallel behaviour depends on how your OpenMolcas was compiled (an MPI-enabled build with Global Arrays is needed for real multi-process parallelism). In practice, this means that, beyond a modest number of cores, adding more cores often gives little or no speedup for typical calculations. This matches what many of us see: the calculation finishes when it finishes, no matter how many cores you throw at it.</p>'+
 '<p>What does matter is memory:</p>'+
 CB(`export MOLCAS_MEM=20000     # in MB, per process
export MOLCAS_DISK=...      # scratch limit, if you wish
export MOLCAS_WORKDIR=/path/to/scratch`,'OpenMolcas environment')+
 '<ul>'+
 '<li><code>MOLCAS_MEM</code> sets the memory (in MB) available to the work arrays of each process.</li>'+
 '<li>Large active spaces, big basis sets with relativistic treatment (Douglas-Kroll or X2C), and spin-orbit RASSI all benefit from more memory.</li>'+
 '<li>If memory is too small, OpenMolcas often falls back to the disk, which is slower, or the job fails.</li>'+
 '<li>Leave headroom: the actual footprint can slightly exceed <code>MOLCAS_MEM</code>, so I set it to around 80 to 90% of what I requested from the scheduler.</li>'+
 '</ul>'+
 '<p>So for OpenMolcas, the practical strategy is: request few cores, request a lot of memory, and give it fast scratch space. Asking for 32 cores on a 251 GiB node while running a mostly serial module wastes cores that other people could use.</p>'+

 '<h3>Gaussian: shared memory, one node</h3>'+
 '<p>Gaussian’s standard parallel model is shared-memory (threads within one node). Multi-node runs require the separate Linda add-on. You set both resources in the input file’s header:</p>'+
 CB(`%nprocshared=16
%mem=64GB
%chk=job.chk`,'Gaussian input')+
 '<ul>'+
 '<li><code>%nprocshared</code> is the number of cores on the node.</li>'+
 '<li><code>%mem</code> is the total memory for the job, not per core. This is the opposite convention from ORCA’s <code>%maxcore</code>.</li>'+
 '<li>The default memory is quite small, so jobs run without a <code>%mem</code> line are often slower than they should be, or fail on larger systems.</li>'+
 '<li>Leave around 10 to 20% of the node’s memory free. Gaussian can use somewhat more than <code>%mem</code> in some steps.</li>'+
 '</ul>'+
 '<p>Gaussian also writes large temporary files (the read-write file, or <code>.rwf</code>) to scratch, so make sure your scratch space is generous. Frequency calculations and large-basis jobs can produce very big scratch files.</p>'+

 '<h3>NWChem: memory per process, and it adds up fast</h3>'+
 '<p>NWChem is MPI-based (using Global Arrays) and was designed for large-scale parallel runs, so it can scale across many cores and nodes. Memory is set with the <code>memory</code> directive in the input file:</p>'+
 CB(`memory total 2000 mb`,'NWChem input')+
 '<p>or in detail:</p>'+
 CB(`memory heap 200 mb stack 1000 mb global 800 mb`,'NWChem input')+
 '<p>Here’s the catch: this is per process (per MPI rank). If you launch 32 processes, each with <code>memory total 2000 mb</code>, the job needs 32 × 2000 MB = 64 GB of node memory. People forget this all the time. Heap is memory for dynamically allocated local data, stack is for temporary local arrays used in calculations, and global is memory shared across processes through Global Arrays, which is where big distributed matrices live.</p>'+
 '<p>Run it with something like:</p>'+
 CB(`mpirun -np 32 nwchem input.nw`,'Command')+
 '<p>If you see errors about <code>ga_create failed</code> or insufficient memory, increase <code>global</code> or the total, or reduce the number of processes per node so that each gets more memory.</p>'+

 '<h2>6. How to choose memory</h2>'+
 '<ol>'+
 '<li><b>Know your node.</b> Run <code>sinfo</code> to see total memory and cores across the compute node. Calculate to know the approximate memory per core.</li>'+
 '<li><b>Leave headroom.</b> Avoid requesting 100% of the node. Keep 10 to 20% for the operating system and the program’s overhead.</li>'+
 '<li><b>Match the program’s convention.</b> Per core (ORCA), per process (OpenMolcas, NWChem), or total (Gaussian). Write the total on paper before submitting.</li>'+
 '<li><b>Make the scheduler and the input agree.</b> If your SLURM script asks for 64 GB but your input asks for 80 GB, the scheduler may kill the job. Always ask the scheduler for slightly more than the input requests.</li>'+
 '<li><b>Start small and check.</b> Run a short test, then look at the actual usage (<code>seff &lt;jobid&gt;</code> or <code>sacct</code> on SLURM, or <code>top</code>/<code>htop</code>). Adjust for the production run.</li>'+
 '<li><b>More is not always faster.</b> Extra cores with too little memory per core cause crashes. Extra memory beyond what the method needs gives no speedup. Do not hog resources that other users are waiting for.</li>'+
 '</ol>'+

 '<h3>A sample SLURM script (ORCA)</h3>'+
 CB(`#!/bin/bash
#SBATCH --job-name=orca_test
#SBATCH --nodes=1
#SBATCH --ntasks=16
#SBATCH --mem=72G
#SBATCH --time=24:00:00
# Input has: %pal nprocs 16 end and %maxcore 4000  (total 64 GB)
/path/to/orca input.inp > output.out`,'SLURM script')+
 '<p>Here the scheduler gets 72 GB, and ORCA is told to aim for 64 GB (16 × 4000 MB). The 8 GB difference is the safety margin.</p>'+

 '<h3>A sample SLURM script (OpenMolcas)</h3>'+
 CB(`#!/bin/bash
#SBATCH --job-name=molcas_test
#SBATCH --nodes=1
#SBATCH --ntasks=4
#SBATCH --mem=120G
#SBATCH --time=48:00:00
export MOLCAS_MEM=100000      # MB per process; keep the total within 120G
export MOLCAS_WORKDIR=$SCRATCH/molcas_$SLURM_JOB_ID
mkdir -p $MOLCAS_WORKDIR
pymolcas input.input -o output.out`,'SLURM script')+
 '<p><b>Note:</b> Adjust <code>MOLCAS_MEM</code> carefully if more than one process is really running.</p>'+

 '<h2>7. Final thoughts</h2>'+
 '<p>Choosing resources is less about memorizing numbers and more about understanding what your program does with them. Once you understand node, core, and memory, those differences make sense, and your jobs spend less time in the queue and more time finishing.</p>'+
 '<p>If you are just starting out or moving into a new cluster, spend time to know the node specifications, run <code>sinfo</code> once, and keep those numbers handy. They will save you many failed jobs.</p>'+
 '<p>Happy computing!</p>'},

{id:"core-hole-to-spectrum",img:"images/blog/xray.svg",date:"2026-11-04",
 title:"From core hole to spectrum",
 sub:"Why X-ray spectra of small heavy-element complexes need more than one configuration",
 tags:["xas","xes","multireference","l-edge","spectroscopy"],toc:true,
 body:'<p class="ph">Placeholder text. Replace it with your own writing when you are ready.</p>'+
 '<h2>Absorption</h2><p>In X-ray absorption, a photon lifts a core electron into an empty orbital and leaves a core hole behind. The energy of the absorbed photon tells us how far that electron moved and what the empty orbitals around the metal look like.</p>'+
 '<h2>Emission</h2><p>In X-ray emission, an electron from a higher occupied level falls into the core hole and a photon leaves. For valence-to-core emission, the electrons that fall are those involved in bonding to the donor atoms of the ligands.</p>'+
 '<h3>Small complexes as test cases</h3><p>Tetrahalide and hexaaqua complexes keep the focus on the metal and its bonded donor atoms, which makes the link between spectrum and bonding easier to read.</p>'+
 '<h2>Why several configurations</h2><p>Near a heavy metal, spin-orbit coupling is large and core-excited states mix several electron configurations. A single-determinant picture misses this, so a multiconfigurational wavefunction is used and the spectrum is built from the computed states and their intensities.</p>'+
 '<p class="ph">Add figures, references and a closing thought here.</p>'},
{id:"actinide-spectroscopy",img:"images/blog/placeholder.svg",date:"",
 title:"Understanding actinide spectroscopy simulations",
 sub:"Electronic structure methods, L-edge spectroscopy and multireference calculations",
 tags:["actinides","xas","l-edge","multireference","spectroscopy"],toc:true,
 body:'<p class="ph">Draft in progress. Full text coming soon.</p><h2>Overview</h2><p class="ph">To be written.</p>'},
{id:"cas-future-leaders",img:"images/blog/placeholder.svg",date:"",
 title:"My experience at the CAS Future Leaders Program",
 sub:"Networking, leadership training and interdisciplinary collaboration",
 tags:["outreach","student-voice"],toc:true,
 body:'<p class="ph">Draft in progress. Full text coming soon.</p><h2>Reflections</h2><p class="ph">To be written.</p>'}
];
