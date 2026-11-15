/* Add new posts at the TOP of this list. Dates are YYYY-MM-DD (shown as 18 November 2026).
   img: banner image path. toc:false hides the Contents tab. Tags must match research.html slugs. */
window.POSTS=[
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
 '<p class="cap">AI-generated illustration of hardware allocations for quantum chemical calculations.</p>'+
 
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
 
 '<h2>3. Reading your node’s memory: an example</h2>'+
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
 
 '<h2>4. Should I increase memory or cores? For effective calculations</h2>'+
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
