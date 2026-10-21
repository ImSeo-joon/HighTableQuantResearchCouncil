document.documentElement.classList.add("reveal-enabled");

const LANGUAGE_KEY = "hightable-language-v2";
const SUPPORTED_LANGUAGES = ["en", "zh", "fr", "ja"];
const appRoutes = {
  research: "#/research",
  labs: "#/labs",
  quant: "#/quant-lab",
  investment: "#/investment-simulator",
  competitions: "#/competitions",
  companies: "#/companies",
  careers: "#/careers",
  interview: "#/interview-lab",
  council: "#/council"
};

const researchTopicRoutes = {
  liquidity: "#/research/liquidity",
  "factor-decay": "#/research/factor-decay",
  "model-governance": "#/research/model-governance",
  "law-and-markets": "#/research/law-and-markets",
  "global-contagion": "#/research/global-contagion",
  "competition-signals": "#/research/competition-signals"
};

let currentLanguage = "ja";
let currentCompany = null;
let currentCareer = null;
let companyRegionFilter = "all";
let activeQuestionCategory = "ibd";
let activeQuestionIndex = 0;
let activeLabId = "compound";
let visitedLabs = new Set(["compound"]);
let activeAppRoute = null;
let activeResearchTopicId = null;
let installPrompt = null;

const companyData = [
  {
    id: "jpmorgan-chase",
    initials: "JPM",
    name: "JPMorgan Chase",
    region: "americas",
    type: { en: "Universal banking", zh: "综合银行" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Investment banking", "Markets", "Commercial banking", "Asset management"],
      zh: ["投资银行", "金融市场", "商业银行", "资产管理"]
    },
    description: {
      en: "One of the world's largest diversified financial institutions, spanning investment banking, markets, commercial banking, consumer banking and asset management. It offers a useful view of how capital, credit and client coverage interact at scale.",
      zh: "全球规模最大的综合金融机构之一，业务覆盖投资银行、金融市场、商业银行、消费金融与资产管理。它有助于理解资本、信用与客户覆盖如何在大规模机构中协同运作。"
    },
    lens: {
      en: "A broad platform where investment bankers, traders, risk teams and relationship managers serve overlapping client needs.",
      zh: "一个广泛的金融服务平台，投资银行、交易、风险和客户关系团队围绕重叠的客户需求协同工作。"
    },
    roles: {
      en: "Investment Banking Analyst, Sales & Trading Analyst, Risk Analyst, Treasury Analyst, Asset Management Analyst",
      zh: "投资银行分析师、销售与交易分析师、风险分析师、资金分析师、资产管理分析师"
    },
    process: {
      en: "Online application → online assessments → interviews → superday or final round; process varies by program and region.",
      zh: "在线申请 → 在线测评 → 面试 → Superday 或终面；具体流程因项目和地区而异。"
    },
    prepare: {
      en: "Build a firm-and-group-specific motivation, master accounting and valuation basics, and prepare examples that show judgment, teamwork and commercial awareness.",
      zh: "准备具体到公司与业务组的动机，掌握会计与估值基础，并积累能够体现判断力、团队协作与商业意识的案例。"
    },
    watch: {
      en: "Program names, deadlines and testing requirements differ across divisions, offices and regions. Always start from the official student programs page.",
      zh: "不同业务线、办公室与地区的项目名称、截止日期和测评要求不同。请始终从官方学生项目页面开始确认。"
    },
    careers: "https://careers.jpmorgan.com/global/en/students"
  },
  {
    id: "goldman-sachs",
    initials: "GS",
    name: "Goldman Sachs",
    region: "americas",
    type: { en: "Investment banking & markets", zh: "投资银行与市场" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Advisory", "Markets", "Asset management", "Wealth"],
      zh: ["顾问业务", "金融市场", "资产管理", "财富管理"]
    },
    description: {
      en: "A global investment bank and financial services firm with advisory, underwriting, markets, asset management and wealth businesses. Its deal and market franchises make it a central reference point for capital formation and strategic advice.",
      zh: "一家全球投资银行与金融服务机构，业务涵盖顾问、承销、金融市场、资产管理和财富管理。其交易与市场业务是理解资本形成与战略顾问的重要参照。"
    },
    lens: {
      en: "A relationship-driven institution where analytical rigor, client communication and execution speed must work together.",
      zh: "一家高度依赖客户关系的机构，分析严谨性、客户沟通与执行速度必须同时发挥作用。"
    },
    roles: {
      en: "Investment Banking Analyst, Global Markets Analyst, Equity Research Associate, Risk Analyst, Asset Management Analyst",
      zh: "投资银行分析师、全球市场分析师、股票研究助理、风险分析师、资产管理分析师"
    },
    process: {
      en: "Online application → assessments or recorded interview where applicable → interviews → superday; exact format varies by division.",
      zh: "在线申请 → 视项目安排的测评或录制面试 → 面试 → Superday；具体形式因业务线而异。"
    },
    prepare: {
      en: "Know why the division fits your evidence, not just why the brand is famous. Practice valuation, market views and concise deal storytelling.",
      zh: "解释业务线为何与你的经历相匹配，而不只是说明品牌为何知名。重点训练估值、市场观点和简洁的交易叙事。"
    },
    watch: {
      en: "Several divisions recruit separately and may use different test providers, interview structures and deadlines.",
      zh: "不同业务线分别招聘，可能使用不同测评供应商、面试结构与截止日期。"
    },
    careers: "https://www.goldmansachs.com/careers"
  },
  {
    id: "morgan-stanley",
    initials: "MS",
    name: "Morgan Stanley",
    region: "americas",
    type: { en: "Investment banking & wealth", zh: "投资银行与财富管理" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Investment banking", "Wealth management", "Investment management", "Markets"],
      zh: ["投资银行", "财富管理", "投资管理", "金融市场"]
    },
    description: {
      en: "A global financial services firm combining institutional securities, investment banking, wealth management and investment management. Its mix offers exposure to both institutional capital markets and private-client solutions.",
      zh: "一家全球金融服务机构，结合机构证券、投资银行、财富管理与投资管理业务，可同时接触机构资本市场与私人客户解决方案。"
    },
    lens: {
      en: "A useful comparison between institutional deal work, wealth advice and asset allocation, all within one financial group.",
      zh: "有助于在同一金融集团中比较机构交易、财富顾问与资产配置三类不同工作。"
    },
    roles: {
      en: "Investment Banking Analyst, Wealth Management Analyst, Sales & Trading Analyst, Risk Analyst, Investment Management Analyst",
      zh: "投资银行分析师、财富管理分析师、销售与交易分析师、风险分析师、投资管理分析师"
    },
    process: {
      en: "Application → online assessment or recorded video → interviews → superday; some programs add a case or technical round.",
      zh: "申请 → 在线测评或录制视频 → 面试 → Superday；部分项目会增加案例或技术环节。"
    },
    prepare: {
      en: "Prepare a division-specific thesis and demonstrate both analytical depth and client empathy. Wealth roles reward portfolio awareness and communication.",
      zh: "准备针对业务线的观点，并同时展现分析深度与客户理解。财富管理岗位尤其重视组合认知和沟通能力。"
    },
    watch: {
      en: "Institutional securities, investment banking and wealth can have distinct recruiting pages and candidate profiles.",
      zh: "机构证券、投资银行与财富管理可能拥有不同的招聘页面和候选人画像。"
    },
    careers: "https://www.morganstanley.com/careers"
  },
  {
    id: "jane-street",
    initials: "JS",
    name: "Jane Street",
    region: "americas",
    type: { en: "Market making", zh: "做市与流动性" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Market making", "Trading", "Technology", "Research"],
      zh: ["做市", "交易", "技术", "研究"]
    },
    description: {
      en: "A global liquidity provider and trading firm whose work spans equities, options, ETFs, bonds, commodities and technology. Its culture is closely associated with collaborative problem-solving and intellectual curiosity.",
      zh: "一家全球流动性提供者与交易机构，业务横跨股票、期权、ETF、债券、大宗商品与技术。其文化强调协作式问题解决和持续求知。"
    },
    lens: {
      en: "A strong reference for people who enjoy probability, market intuition, clear reasoning and explaining an idea to a smart colleague.",
      zh: "适合享受概率问题、市场直觉、清晰推理，并能向聪明同事讲清一个想法的人。"
    },
    roles: {
      en: "Quantitative Trader, Software Engineer, Quantitative Researcher, Strategy Analyst",
      zh: "量化交易员、软件工程师、量化研究员、策略分析师"
    },
    process: {
      en: "Application → interviews focused on problem solving and probability → deeper technical and team conversations; exact rounds vary by role.",
      zh: "申请 → 侧重问题解决与概率的面试 → 更深入的技术与团队交流；具体轮次因岗位而异。"
    },
    prepare: {
      en: "Practice expected value, mental math, probability and structured communication. Be ready to revise your approach when new information appears.",
      zh: "训练期望值、心算、概率与结构化表达，并准备好在出现新信息时修正原有思路。"
    },
    watch: {
      en: "Different offices and desks may recruit through distinct processes. Verify role requirements with official listings.",
      zh: "不同办公室和业务台可能采用不同招聘流程，请以官方岗位说明为准。"
    },
    careers: "https://www.janestreet.com/join-jane-street/"
  },
  {
    id: "citadel",
    initials: "C",
    name: "Citadel",
    region: "americas",
    type: { en: "Multi-strategy investment", zh: "多策略投资" },
    location: { en: "Miami / New York / Global", zh: "迈阿密 / 纽约 / 全球" },
    sectors: {
      en: ["Hedge fund", "Equities", "Commodities", "Credit", "Quantitative strategies"],
      zh: ["对冲基金", "股票", "大宗商品", "信用", "量化策略"]
    },
    description: {
      en: "A multi-strategy investment firm operating through teams across equities, commodities, fixed income and credit, quantitative strategies and other disciplines. Citadel and Citadel Securities are separate businesses.",
      zh: "一家多策略投资机构，团队覆盖股票、大宗商品、固定收益与信用、量化策略及其他领域。Citadel 与 Citadel Securities 是相互独立的业务实体。"
    },
    lens: {
      en: "A landscape of specialist investment teams in which research quality, accountability and rapid feedback loops are central.",
      zh: "由多个专业投资团队构成的行业版图，研究质量、责任承担和快速反馈循环是其核心。"
    },
    roles: {
      en: "Investment Analyst, Quantitative Researcher, Software Engineer, Risk Analyst, Corporate Development Analyst",
      zh: "投资分析师、量化研究员、软件工程师、风险分析师、企业发展分析师"
    },
    process: {
      en: "Application → resume and technical screen → role-specific interviews → team or final discussions; processes differ by business.",
      zh: "申请 → 简历与技术筛选 → 岗位专项面试 → 团队或终面交流；不同业务流程不同。"
    },
    prepare: {
      en: "Build one deep technical strength and one persuasive market narrative. Expect questions that test both analytical accuracy and judgment.",
      zh: "建立一项扎实的技术能力与一套有说服力的市场叙事，准备回答同时检验分析准确性和判断力的问题。"
    },
    watch: {
      en: "Distinguish between the hedge fund and the separate market-making business when researching teams or openings.",
      zh: "研究团队或岗位时，应区分对冲基金业务与独立的做市业务。"
    },
    careers: "https://www.citadel.com/careers/"
  },
  {
    id: "two-sigma",
    initials: "2S",
    name: "Two Sigma",
    region: "americas",
    type: { en: "Systematic investing", zh: "系统性投资" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Systematic investing", "Data science", "Engineering", "Private markets"],
      zh: ["系统性投资", "数据科学", "工程", "私募市场"]
    },
    description: {
      en: "A technology-driven investment manager that combines data science, research and engineering to build systematic strategies across multiple asset classes.",
      zh: "一家技术驱动的投资管理机构，将数据科学、研究与工程结合，构建覆盖多资产类别的系统性策略。"
    },
    lens: {
      en: "A useful case study in how scientific experimentation, data infrastructure and model governance operate inside an investment organization.",
      zh: "理解科学实验、数据基础设施和模型治理如何在投资机构内部运作的重要案例。"
    },
    roles: {
      en: "Quantitative Researcher, Data Scientist, Software Engineer, Model Risk Analyst, Investment Analyst",
      zh: "量化研究员、数据科学家、软件工程师、模型风险分析师、投资分析师"
    },
    process: {
      en: "Application → technical screen or assessment → multiple interviews → team fit; coding and research depth vary by role.",
      zh: "申请 → 技术筛选或测评 → 多轮面试 → 团队匹配；编程与研究深度要求因岗位而异。"
    },
    prepare: {
      en: "Show sound empirical thinking: clean feature design, honest validation, computational care and a clear account of failure modes.",
      zh: "展现严谨的实证思维：干净的特征设计、诚实的验证、扎实的计算能力，以及对模型失效模式的清晰理解。"
    },
    watch: {
      en: "Research, engineering and investing tracks can ask for very different evidence. Read the role specification closely.",
      zh: "研究、工程与投资岗位的证据要求可能非常不同，应仔细阅读岗位说明。"
    },
    careers: "https://www.twosigma.com/careers/"
  },
  {
    id: "ubs",
    initials: "UBS",
    name: "UBS",
    region: "europe",
    type: { en: "Global wealth & banking", zh: "全球财富管理与银行" },
    location: { en: "Zurich / London / Global", zh: "苏黎世 / 伦敦 / 全球" },
    sectors: {
      en: ["Global wealth management", "Investment banking", "Asset management", "Swiss banking"],
      zh: ["全球财富管理", "投资银行", "资产管理", "瑞士银行"]
    },
    description: {
      en: "A global wealth manager and universal bank with investment banking and asset management capabilities. Its Swiss base and international footprint make it a useful lens on cross-border wealth and capital markets.",
      zh: "一家全球财富管理机构与综合银行，具备投资银行和资产管理能力。其瑞士根基与国际网络有助于理解跨境财富与资本市场。"
    },
    lens: {
      en: "A bridge between private wealth, institutional markets and global banking, with strong client-advisory dimensions.",
      zh: "连接私人财富、机构市场与全球银行业，具有鲜明的客户顾问属性。"
    },
    roles: {
      en: "Global Banking Analyst, Wealth Management Analyst, Markets Analyst, Risk Analyst, Asset Management Analyst",
      zh: "全球银行分析师、财富管理分析师、市场分析师、风险分析师、资产管理分析师"
    },
    process: {
      en: "Application → online assessment → interviews → assessment center or final round; requirements vary by country and program.",
      zh: "申请 → 在线测评 → 面试 → 评估中心或终面；要求因国家和项目而异。"
    },
    prepare: {
      en: "Understand client segmentation, portfolio basics and the regulatory context of cross-border wealth. Practice clear recommendations for non-specialist clients.",
      zh: "理解客户分层、组合基础与跨境财富的监管语境，并练习向非专业客户清晰提出建议。"
    },
    watch: {
      en: "Programs are administered locally and may have country-specific work authorization and language requirements.",
      zh: "项目通常由各地区本地管理，可能有特定的工作资格与语言要求。"
    },
    careers: "https://www.ubs.com/global/en/careers.html"
  },
  {
    id: "bnp-paribas",
    initials: "BNP",
    name: "BNP Paribas",
    region: "europe",
    type: { en: "European universal bank", zh: "欧洲综合银行" },
    location: { en: "Paris / London / Global", zh: "巴黎 / 伦敦 / 全球" },
    sectors: {
      en: ["Corporate banking", "Global markets", "Financing", "Investment solutions"],
      zh: ["公司银行", "全球市场", "融资", "投资解决方案"]
    },
    description: {
      en: "A European banking group with major global markets, financing and advisory activities. Quantitative, risk and coverage careers often sit at the intersection of products, regulation and client needs.",
      zh: "一家欧洲银行集团，拥有重要的全球市场、融资与顾问业务。量化、风险与客户覆盖岗位通常位于产品、监管和客户需求的交汇处。"
    },
    lens: {
      en: "Especially relevant for structured products, derivatives, balance-sheet constraints and the legal architecture of banking.",
      zh: "尤其适合理解结构性产品、衍生品、资产负债表约束，以及银行业务的法律架构。"
    },
    roles: {
      en: "Corporate Banking Analyst, Global Markets Analyst, Quantitative Research Analyst, Risk Analyst, Compliance Analyst",
      zh: "公司银行分析师、全球市场分析师、量化研究分析师、风险分析师、合规分析师"
    },
    process: {
      en: "Application → online tests → interviews → assessment center or final interviews; processes vary by country and business line.",
      zh: "申请 → 在线测试 → 面试 → 评估中心或终面；流程因国家和业务线而异。"
    },
    prepare: {
      en: "Connect pricing theory to real balance-sheet and regulatory constraints. French may help in some teams but is not required everywhere.",
      zh: "将定价理论与资产负债表及监管约束连接起来。部分团队可能看语法语，但并非所有岗位必需。"
    },
    watch: {
      en: "Product groups and regional offices differ significantly. Check the exact entity, city and regulatory context.",
      zh: "不同产品团队与地区办公室差异显著，应确认具体法人、城市和监管环境。"
    },
    careers: "https://group.bnpparibas/en/careers"
  },
  {
    id: "man-group",
    initials: "MG",
    name: "Man Group",
    region: "europe",
    type: { en: "Systematic alternatives", zh: "系统化另类投资" },
    location: { en: "London / Global", zh: "伦敦 / 全球" },
    sectors: {
      en: ["Systematic investing", "Discretionary investing", "Solutions", "Private markets"],
      zh: ["系统化投资", "自主投资", "投资解决方案", "私募市场"]
    },
    description: {
      en: "A global investment management business with systematic, discretionary and solutions capabilities. Its multi-manager structure offers a view of how different investment cultures coexist.",
      zh: "一家拥有系统化、自主决策和解决方案能力的全球投资管理集团。其多管理人结构有助于观察不同投资文化如何并存。"
    },
    lens: {
      en: "A bridge between systematic research, client solutions and institutional asset management rather than a single trading desk.",
      zh: "连接系统化研究、客户解决方案与机构资产管理，而不是单一交易台。"
    },
    roles: {
      en: "Quantitative Researcher, Portfolio Analyst, Client Solutions Analyst, Risk Analyst, Technology Analyst",
      zh: "量化研究员、组合分析师、客户解决方案分析师、风险分析师、技术分析师"
    },
    process: {
      en: "Application → numerical or coding assessment → interviews → team and final conversations; process differs by investment engine.",
      zh: "申请 → 数理或编程测评 → 面试 → 团队与终面交流；不同投资引擎流程不同。"
    },
    prepare: {
      en: "Study both the research process and its commercial context. Be able to explain why a strategy matters to an institutional investor.",
      zh: "同时理解研究过程及其商业语境，并能够解释一项策略为何对机构投资者重要。"
    },
    watch: {
      en: "The group contains distinct investment engines and brands. Research the specific team rather than relying on the group name alone.",
      zh: "集团旗下包含不同投资引擎与品牌，应研究具体团队，而不是只看集团名称。"
    },
    careers: "https://www.man.com/careers"
  },
  {
    id: "lseg",
    initials: "LSEG",
    name: "London Stock Exchange Group",
    region: "europe",
    type: { en: "Market infrastructure & data", zh: "市场基础设施与数据" },
    location: { en: "London / Global", zh: "伦敦 / 全球" },
    sectors: {
      en: ["Financial data", "Trading venues", "Clearing", "Risk analytics"],
      zh: ["金融数据", "交易场所", "清算", "风险分析"]
    },
    description: {
      en: "A global financial markets infrastructure and data business spanning trading, clearing, benchmarks, risk analytics and information services. It sits behind many decisions rather than only in front of clients.",
      zh: "一家全球金融市场基础设施与数据企业，业务覆盖交易、清算、基准、风险分析与信息服务，更多服务于决策背后的市场基础设施。"
    },
    lens: {
      en: "A strong view of the plumbing of finance: reference data, indices, trading workflows, clearing and regulatory technology.",
      zh: "理解金融基础设施的重要视角：参考数据、指数、交易工作流、清算与监管科技。"
    },
    roles: {
      en: "Financial Data Analyst, Product Analyst, Risk Technology Analyst, Operations Analyst, Software Engineer",
      zh: "金融数据分析师、产品分析师、风险技术分析师、运营分析师、软件工程师"
    },
    process: {
      en: "Application → online assessment → interviews → assessment center or final round; technical roles may add a coding stage.",
      zh: "申请 → 在线测评 → 面试 → 评估中心或终面；技术岗位可能增加编程环节。"
    },
    prepare: {
      en: "Understand market data flows and the difference between a trading venue, clearing house and analytics provider. Practice product thinking and data quality questions.",
      zh: "理解市场数据流，以及交易场所、清算机构与分析供应商的区别，并练习产品思维和数据质量相关问题。"
    },
    watch: {
      en: "LSEG includes multiple businesses and brands; role expectations vary across data, exchange and post-trade functions.",
      zh: "LSEG 包含多个业务与品牌，数据、交易与交易后职能的岗位要求各不相同。"
    },
    careers: "https://www.lseg.com/en/careers"
  },
  {
    id: "nomura",
    initials: "N",
    name: "Nomura",
    region: "asia",
    type: { en: "Japan-rooted global markets", zh: "立足日本的全球市场" },
    location: { en: "Tokyo / Global", zh: "东京 / 全球" },
    sectors: {
      en: ["Global markets", "Investment banking", "Asset management", "Research"],
      zh: ["全球市场", "投资银行", "资产管理", "研究"]
    },
    description: {
      en: "A Japan-headquartered financial services group with global markets, investment banking and asset management capabilities. It is an important lens on Asia-Pacific capital flows and cross-border finance.",
      zh: "一家总部位于日本的金融服务集团，具备全球市场、投资银行与资产管理能力，是观察亚太资本流动和跨境金融的重要窗口。"
    },
    lens: {
      en: "A useful vantage point for Japan-market expertise, Asia-Pacific client coverage and the interaction between global products and local regulation.",
      zh: "观察日本市场专业能力、亚太客户覆盖，以及全球产品与本地监管互动的重要视角。"
    },
    roles: {
      en: "Global Markets Analyst, Investment Banking Analyst, Risk Analyst, Research Associate, Asset Management Analyst",
      zh: "全球市场分析师、投资银行分析师、风险分析师、研究助理、资产管理分析师"
    },
    process: {
      en: "Application → online assessment → interviews → final round; Tokyo and international offices may use different schedules.",
      zh: "申请 → 在线测评 → 面试 → 终面；东京与国际办公室可能采用不同日程。"
    },
    prepare: {
      en: "Develop regional market awareness alongside technical ability. Be ready to discuss Japan's role in global capital markets.",
      zh: "在技术能力之外建立区域市场认知，并准备讨论日本在全球资本市场中的角色。"
    },
    watch: {
      en: "Language expectations and work authorization vary by role and location. Check each office's official posting.",
      zh: "语言要求和工作资格因岗位与地点而异，请核对各办公室的官方招聘信息。"
    },
    careers: "https://www.nomura.com/careers/"
  },
  {
    id: "mufg",
    initials: "MUFG",
    name: "Mitsubishi UFJ Financial Group",
    region: "asia",
    type: { en: "Global banking group", zh: "全球银行集团" },
    location: { en: "Tokyo / Global", zh: "东京 / 全球" },
    sectors: {
      en: ["Corporate banking", "Global markets", "Trust banking", "Asset management"],
      zh: ["公司银行", "全球市场", "信托银行", "资产管理"]
    },
    description: {
      en: "A Japan-based global financial group with banking, trust, securities and asset management operations. Its corporate and cross-border relationships provide a strong view of finance beyond trading.",
      zh: "一家总部位于日本的全球金融集团，业务包括银行、信托、证券与资产管理。其公司与跨境客户关系提供了交易之外的重要金融视角。"
    },
    lens: {
      en: "A relationship and balance-sheet business where credit judgment, client coverage and cross-border coordination matter.",
      zh: "一家以客户关系与资产负债表为核心的机构，信用判断、客户覆盖与跨境协调至关重要。"
    },
    roles: {
      en: "Corporate Banking Analyst, Credit Analyst, Global Markets Analyst, Treasury Analyst, Risk Analyst",
      zh: "公司银行分析师、信用分析师、全球市场分析师、资金分析师、风险分析师"
    },
    process: {
      en: "Application → online tests → interviews → final round; local and global programs may differ.",
      zh: "申请 → 在线测试 → 面试 → 终面；本地与全球项目可能不同。"
    },
    prepare: {
      en: "Understand lending, credit analysis and relationship banking. Prepare clear views on Japanese corporates and cross-border capital needs.",
      zh: "理解贷款、信用分析与关系银行，并准备关于日本企业和跨境资本需求的清晰观点。"
    },
    watch: {
      en: "The group operates through multiple entities and brands. Confirm which legal entity and office is hiring.",
      zh: "集团通过多个法人实体与品牌运营，应确认具体招聘主体和办公室。"
    },
    careers: "https://www.mufg.jp/english/careers/"
  },
  {
    id: "dbs",
    initials: "DBS",
    name: "DBS",
    region: "asia",
    type: { en: "Asian universal bank", zh: "亚洲综合银行" },
    location: { en: "Singapore / Asia", zh: "新加坡 / 亚洲" },
    sectors: {
      en: ["Corporate banking", "Consumer banking", "Treasury", "Digital finance"],
      zh: ["公司银行", "消费金融", "资金业务", "数字金融"]
    },
    description: {
      en: "A major Asian banking group with corporate, institutional and consumer businesses and a strong digital transformation agenda. It is a useful lens on Southeast Asian credit and wealth markets.",
      zh: "一家重要的亚洲银行集团，业务覆盖公司、机构与消费金融，并拥有鲜明的数字化转型议程，是理解东南亚信用与财富市场的重要窗口。"
    },
    lens: {
      en: "A technology-forward bank where product, risk and data roles increasingly sit close to commercial decisions.",
      zh: "一家数字化程度较高的银行，产品、风险与数据岗位日益贴近商业决策。"
    },
    roles: {
      en: "Corporate Banking Analyst, Credit Risk Analyst, Treasury Analyst, Product Analyst, Data Analyst",
      zh: "公司银行分析师、信用风险分析师、资金分析师、产品分析师、数据分析师"
    },
    process: {
      en: "Application → online assessment → interviews → assessment center or final panel; programs vary by market.",
      zh: "申请 → 在线测评 → 面试 → 评估中心或终面；项目因市场而异。"
    },
    prepare: {
      en: "Know Southeast Asia's growth drivers, basic credit analysis and the role of digital banking. Show client empathy as well as analytical skill.",
      zh: "了解东南亚增长驱动、基础信用分析与数字银行角色，同时展现客户理解与分析能力。"
    },
    watch: {
      en: "DBS recruits across several Asian markets with local eligibility rules. Verify work authorization for the specific location.",
      zh: "星展在多个亚洲市场招聘并执行本地资格规则，应核实具体地点的工作资格。"
    },
    careers: "https://www.dbs.com/careers/default.page"
  },
  {
    id: "cicc",
    initials: "CICC",
    name: "CICC",
    region: "asia",
    type: { en: "Investment banking", zh: "投资银行" },
    location: { en: "Beijing / Hong Kong / China", zh: "北京 / 香港 / 中国" },
    sectors: {
      en: ["Investment banking", "Equity research", "Wealth", "Private equity"],
      zh: ["投资银行", "股票研究", "财富管理", "私募股权"]
    },
    description: {
      en: "A China-rooted investment bank with investment banking, research, wealth and private-market capabilities. It is a key reference for domestic capital markets and cross-border China transactions.",
      zh: "一家立足中国的投资银行，具备投行、研究、财富与私募市场能力，是理解中国境内资本市场与跨境交易的重要参照。"
    },
    lens: {
      en: "A useful view of IPO, M&A, equity research and wealth work inside China's evolving capital markets.",
      zh: "观察中国资本市场中 IPO、并购、股票研究与财富业务的重要视角。"
    },
    roles: {
      en: "Investment Banking Analyst, Equity Research Associate, Private Equity Analyst, Wealth Management Analyst",
      zh: "投资银行分析师、股票研究助理、私募股权分析师、财富管理分析师"
    },
    process: {
      en: "Application → written or aptitude screen → interviews → final round; programs and language requirements vary.",
      zh: "申请 → 笔试或能力筛选 → 面试 → 终面；项目与语言要求会有所不同。"
    },
    prepare: {
      en: "Build China-market awareness, accounting and valuation skills, and a clear view on sector and transaction logic. Practice concise Chinese business communication.",
      zh: "建立中国市场认知、会计与估值能力，以及清晰的行业和交易逻辑。练习简洁的中文商务表达。"
    },
    watch: {
      en: "Mainland and Hong Kong roles may differ in licensing, language, work authorization and recruiting schedule.",
      zh: "内地与香港岗位在牌照、语言、工作资格和招聘时间线上可能不同。"
    },
    careers: "https://www.cicc.com/careers/"
  },
  {
    id: "blackrock",
    initials: "BLK",
    name: "BlackRock",
    region: "americas",
    type: { en: "Asset management & technology", zh: "资产管理与金融科技" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Asset management", "ETF and index", "Risk technology", "Private markets"],
      zh: ["资产管理", "ETF 与指数", "风险科技", "私募市场"]
    },
    description: {
      en: "A global asset manager spanning index funds, active strategies, private markets and investment technology. Its scale offers a view of how research, portfolio management and client solutions operate together.",
      zh: "一家全球资产管理机构，业务覆盖指数基金、主动策略、私募市场与投资技术。其规模有助于观察研究、组合管理与客户解决方案如何协同。"
    },
    lens: {
      en: "A useful reference for passive investing, multi-asset portfolios, institutional client work and Aladdin-style risk platforms.",
      zh: "理解被动投资、多资产组合、机构客户业务与 Aladdin 类风险平台的重要参照。"
    },
    roles: {
      en: "Investment Research Analyst, Portfolio Management Analyst, Risk Analyst, Product Strategist, Financial Technology Analyst",
      zh: "投资研究分析师、组合管理分析师、风险分析师、产品策略师、金融科技分析师"
    },
    process: {
      en: "Application → online assessment → interviews → final or superday; technology and investment tracks may differ.",
      zh: "申请 → 在线测评 → 面试 → 终面或 Superday；技术与投资岗位流程可能不同。"
    },
    prepare: {
      en: "Understand asset allocation, ETF mechanics, portfolio risk and client outcomes. Be prepared to explain a market view with data rather than headlines.",
      zh: "理解资产配置、ETF 机制、组合风险与客户结果，并能够用数据而非新闻标题解释市场观点。"
    },
    watch: {
      en: "Investment, client-business and technology programs recruit separately with different technical requirements.",
      zh: "投资、客户业务与技术项目分开招聘，技术要求各不相同。"
    },
    careers: "https://careers.blackrock.com/"
  },
  {
    id: "kkr",
    initials: "KKR",
    name: "KKR",
    region: "americas",
    type: { en: "Private markets", zh: "私募市场" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Private equity", "Infrastructure", "Credit", "Real assets"],
      zh: ["私募股权", "基础设施", "信用", "实物资产"]
    },
    description: {
      en: "A global investment firm active in private equity, infrastructure, credit, real assets and strategic capital. Its model connects investment diligence with hands-on portfolio work.",
      zh: "一家活跃于私募股权、基础设施、信用、实物资产与战略资本的全球投资机构。其模式将投资尽调与深度投后管理连接起来。"
    },
    lens: {
      en: "A strong case study in long-duration capital, operating value creation and investment judgment beyond public-market pricing.",
      zh: "理解长期资本、运营价值创造，以及公开市场定价之外的投资判断的重要案例。"
    },
    roles: {
      en: "Private Equity Analyst, Credit Analyst, Infrastructure Analyst, Portfolio Operations Analyst",
      zh: "私募股权分析师、信用分析师、基础设施分析师、投后运营分析师"
    },
    process: {
      en: "Application → modeling or case assessment → interviews → investment-team discussions; process varies by strategy.",
      zh: "申请 → 建模或案例测评 → 面试 → 投资团队交流；具体流程因策略而异。"
    },
    prepare: {
      en: "Practice LBOs, company diligence, industry mapping and value-creation logic. Show commercial curiosity and the ability to test management assumptions.",
      zh: "训练 LBO、公司尽调、行业图谱与价值创造逻辑，展现商业好奇心以及检验管理层假设的能力。"
    },
    watch: {
      en: "Private-markets roles often require prior deal, modeling or consulting experience; entry routes may not be annual graduate programs.",
      zh: "私募市场岗位通常要求交易、建模或咨询经验，入门路径未必是固定年度应届项目。"
    },
    careers: "https://www.kkr.com/careers"
  },
  {
    id: "msci",
    initials: "MSCI",
    name: "MSCI",
    region: "americas",
    type: { en: "Indices, data & analytics", zh: "指数、数据与分析" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Indices", "ESG research", "Portfolio analytics", "Market data"],
      zh: ["指数", "ESG 研究", "组合分析", "市场数据"]
    },
    description: {
      en: "A provider of indices, portfolio analytics, ESG and climate research, and market data. It helps investors define benchmarks and measure portfolio decisions at global scale.",
      zh: "一家提供指数、组合分析、ESG 与气候研究以及市场数据的机构，帮助投资者在全球范围内定义基准并衡量组合决策。"
    },
    lens: {
      en: "A direct view of benchmarks, factor models, data methodology and the infrastructure behind investment comparison.",
      zh: "直接观察基准、因子模型、数据方法论与投资比较基础设施的视角。"
    },
    roles: {
      en: "Index Research Analyst, ESG Research Analyst, Product Analyst, Data Scientist, Client Coverage Analyst",
      zh: "指数研究分析师、ESG 研究分析师、产品分析师、数据科学家、客户覆盖分析师"
    },
    process: {
      en: "Application → online assessment → interviews → final round; research and technology roles add role-specific exercises.",
      zh: "申请 → 在线测评 → 面试 → 终面；研究与技术岗位可能增加专项测试。"
    },
    prepare: {
      en: "Study index construction, portfolio optimization and data quality. Be able to explain methodology choices and their consequences for investors.",
      zh: "学习指数构建、组合优化与数据质量，并能够解释方法选择对投资者的影响。"
    },
    watch: {
      en: "Roles may sit in research, product, client coverage or technology. The required mix of finance and coding differs significantly.",
      zh: "岗位可能属于研究、产品、客户覆盖或技术团队，对金融与编程能力的要求差异显著。"
    },
    careers: "https://www.msci.com/careers"
  },
  {
    id: "hsbc",
    initials: "HSBC",
    name: "HSBC",
    region: "europe",
    type: { en: "Global banking & trade", zh: "全球银行与贸易金融" },
    location: { en: "London / Hong Kong / Global", zh: "伦敦 / 香港 / 全球" },
    sectors: {
      en: ["Global banking", "Markets", "Wealth", "Trade finance"],
      zh: ["全球银行", "金融市场", "财富管理", "贸易金融"]
    },
    description: {
      en: "A global banking group with a distinctive international network across Europe, Asia and the Americas. Corporate banking, trade finance and cross-border connectivity are central to its franchise.",
      zh: "一家在欧洲、亚洲与美洲拥有鲜明国际网络的全球银行集团，公司银行、贸易金融与跨境连接是其核心业务。"
    },
    lens: {
      en: "A useful lens on cross-border clients, trade flows, foreign exchange and the coordination of global banking products.",
      zh: "观察跨境客户、贸易流、外汇与全球银行产品协同的重要视角。"
    },
    roles: {
      en: "Global Banking Analyst, Trade Finance Analyst, Markets Analyst, Risk Analyst, Wealth Analyst",
      zh: "全球银行分析师、贸易金融分析师、市场分析师、风险分析师、财富分析师"
    },
    process: {
      en: "Application → online assessments → interview or assessment center → final round; country programs vary.",
      zh: "申请 → 在线测评 → 面试或评估中心 → 终面；各国项目有所不同。"
    },
    prepare: {
      en: "Understand trade finance, FX, credit and the client relationship model. Prepare a view on how regional trade corridors create banking demand.",
      zh: "理解贸易金融、外汇、信用与客户关系模式，并准备区域贸易走廊如何创造银行需求的观点。"
    },
    watch: {
      en: "HSBC's products and graduate schemes are organized by market and global business. Check the exact country page.",
      zh: "汇丰的产品与应届生项目按市场和全球业务线组织，应核对具体国家页面。"
    },
    careers: "https://www.hsbc.com/careers"
  },
  {
    id: "deutsche-bank",
    initials: "DB",
    name: "Deutsche Bank",
    region: "europe",
    type: { en: "European banking & markets", zh: "欧洲银行与市场" },
    location: { en: "Frankfurt / London / Global", zh: "法兰克福 / 伦敦 / 全球" },
    sectors: {
      en: ["Investment banking", "Fixed income", "Corporate banking", "Asset management"],
      zh: ["投资银行", "固定收益", "公司银行", "资产管理"]
    },
    description: {
      en: "A European bank with corporate banking, investment banking, markets and asset management capabilities. Its fixed-income and European corporate network offer a useful industry lens.",
      zh: "一家拥有公司银行、投资银行、金融市场与资产管理能力的欧洲银行，其固定收益与欧洲企业网络提供了重要行业视角。"
    },
    lens: {
      en: "A bridge between European corporate finance, global markets and the control functions that support complex banking products.",
      zh: "连接欧洲公司金融、全球市场与复杂银行产品控制职能的重要桥梁。"
    },
    roles: {
      en: "Corporate Finance Analyst, Fixed Income Analyst, Credit Risk Analyst, Compliance Analyst, Treasury Analyst",
      zh: "公司金融分析师、固定收益分析师、信用风险分析师、合规分析师、资金分析师"
    },
    process: {
      en: "Application → online tests → interviews → assessment center or final round; formats differ by division.",
      zh: "申请 → 在线测试 → 面试 → 评估中心或终面；不同业务线形式不同。"
    },
    prepare: {
      en: "Prepare credit and rates fundamentals, accounting and a credible European market view. Practice explaining complex products simply.",
      zh: "准备信用与利率基础、会计知识和可信的欧洲市场观点，并练习用简洁语言解释复杂产品。"
    },
    watch: {
      en: "Several divisions run separate programs with different language, location and technical expectations.",
      zh: "多个业务线运营独立项目，语言、地点与技术要求各不相同。"
    },
    careers: "https://careers.db.com/"
  },
  {
    id: "societe-generale",
    initials: "SG",
    name: "Société Générale",
    region: "europe",
    type: { en: "French banking & derivatives", zh: "法国银行与衍生品" },
    location: { en: "Paris / Global", zh: "巴黎 / 全球" },
    sectors: {
      en: ["Global markets", "Derivatives", "Corporate banking", "Mobility finance"],
      zh: ["全球市场", "衍生品", "公司银行", "出行金融"]
    },
    description: {
      en: "A French banking group with global markets, financing and advisory, corporate banking and specialised financial services. Derivatives and structured solutions are important parts of its franchise.",
      zh: "一家法国银行集团，业务覆盖全球市场、融资与顾问、公司银行及专业金融服务，衍生品与结构化解决方案是其重要业务。"
    },
    lens: {
      en: "A strong reference for equity derivatives, structured products, quantitative pricing and European client solutions.",
      zh: "理解股票衍生品、结构性产品、量化定价与欧洲客户解决方案的重要参照。"
    },
    roles: {
      en: "Global Markets Analyst, Quantitative Analyst, Structuring Analyst, Risk Analyst, Corporate Banking Analyst",
      zh: "全球市场分析师、量化分析师、结构化产品分析师、风险分析师、公司银行分析师"
    },
    process: {
      en: "Application → online test → interviews → assessment center; quantitative roles may add a technical exercise.",
      zh: "申请 → 在线测试 → 面试 → 评估中心；量化岗位可能增加技术测试。"
    },
    prepare: {
      en: "Review probability, derivatives pricing and market structures. French can help in Paris teams but requirements vary by role.",
      zh: "复习概率、衍生品定价与市场结构。巴黎团队可能看重法语，但岗位要求不尽相同。"
    },
    watch: {
      en: "Programs are recruited locally across multiple countries; check language and work authorization requirements.",
      zh: "项目在多个国家本地招聘，应核对语言与工作资格要求。"
    },
    careers: "https://careers.societegenerale.com/"
  },
  {
    id: "mizuho",
    initials: "MH",
    name: "Mizuho Financial Group",
    region: "asia",
    type: { en: "Japan banking & markets", zh: "日本银行与市场" },
    location: { en: "Tokyo / Global", zh: "东京 / 全球" },
    sectors: {
      en: ["Corporate banking", "Global markets", "Trust", "Asset management"],
      zh: ["公司银行", "全球市场", "信托", "资产管理"]
    },
    description: {
      en: "A Japanese financial group combining banking, trust, securities and research capabilities. It offers another important route into Japan's corporate lending and cross-border capital markets.",
      zh: "一家结合银行、信托、证券与研究能力的日本金融集团，是理解日本企业信贷与跨境资本市场的另一条重要路径。"
    },
    lens: {
      en: "A balance-sheet and relationship-oriented institution where credit, corporate coverage and market products reinforce one another.",
      zh: "一家以资产负债表与客户关系为核心的机构，信用、企业覆盖与市场产品相互强化。"
    },
    roles: {
      en: "Corporate Banking Analyst, Credit Analyst, Global Markets Analyst, Research Analyst, Risk Analyst",
      zh: "公司银行分析师、信用分析师、全球市场分析师、研究分析师、风险分析师"
    },
    process: {
      en: "Application → online tests → interviews → final round; Japanese and international programs differ.",
      zh: "申请 → 在线测试 → 面试 → 终面；日本本土与国际项目有所不同。"
    },
    prepare: {
      en: "Build lending and credit fundamentals plus regional market awareness. Be prepared to explain how Japanese capital connects with global clients.",
      zh: "建立贷款与信用基础以及区域市场认知，并准备解释日本资本与全球客户的连接方式。"
    },
    watch: {
      en: "Language and work authorization requirements vary sharply between Tokyo and overseas offices.",
      zh: "东京与海外办公室的语言及工作资格要求差异较大。"
    },
    careers: "https://www.mizuhogroup.com/careers"
  },
  {
    id: "hkex",
    initials: "HKEX",
    name: "Hong Kong Exchanges and Clearing",
    region: "asia",
    type: { en: "Market infrastructure", zh: "市场基础设施" },
    location: { en: "Hong Kong / Asia", zh: "香港 / 亚洲" },
    sectors: {
      en: ["Exchanges", "Clearing", "Market data", "Listing and regulation"],
      zh: ["交易所", "清算", "市场数据", "上市与监管"]
    },
    description: {
      en: "The operator of Hong Kong's securities and derivatives markets and a major regional market-infrastructure group. Its work connects listings, trading, clearing and regulatory operations.",
      zh: "香港证券与衍生品市场的运营方，也是重要的区域市场基础设施集团，业务连接上市、交易、清算与监管运营。"
    },
    lens: {
      en: "A finance role can sit in market operations, product, data, risk or regulation—not only in a bank or investment fund.",
      zh: "金融职业可以存在于市场运营、产品、数据、风险或监管领域，而不只是银行或投资基金。"
    },
    roles: {
      en: "Market Operations Analyst, Product Development Analyst, Risk Analyst, Regulatory Analyst, Data Analyst",
      zh: "市场运营分析师、产品开发分析师、风险分析师、监管分析师、数据分析师"
    },
    process: {
      en: "Application → aptitude or domain assessment → interviews → final round; technical roles may include coding.",
      zh: "申请 → 能力或领域测评 → 面试 → 终面；技术岗位可能包含编程环节。"
    },
    prepare: {
      en: "Understand trading and clearing workflows, market microstructure and Hong Kong's role as a connectivity hub.",
      zh: "理解交易与清算流程、市场微观结构，以及香港作为连接枢纽的角色。"
    },
    watch: {
      en: "Market-infrastructure roles may emphasize operations, regulation and technology more than investing.",
      zh: "市场基础设施岗位可能更重视运营、监管与技术，而非直接投资研究。"
    },
    careers: "https://www.hkexgroup.com/careers-at-hkex/"
  },
  {
    id: "evercore",
    initials: "EVR",
    name: "Evercore",
    region: "americas",
    type: { en: "Independent advisory", zh: "独立顾问银行" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["M&A advisory", "Restructuring", "Capital advisory", "Underwriting"],
      zh: ["并购顾问", "重组", "资本顾问", "承销"]
    },
    description: {
      en: "An independent investment bank focused on strategic advisory, M&A, restructuring and capital solutions. Its model emphasizes senior-banker involvement and conflict-light advice.",
      zh: "一家专注于战略顾问、并购、重组和资本解决方案的独立投资银行，强调资深银行家的深度参与与相对清晰的利益关系。"
    },
    lens: {
      en: "A useful contrast to balance-sheet banks: advice is the core product, with less exposure to proprietary lending and trading.",
      zh: "与资产负债表型银行形成鲜明对照：顾问服务是核心产品，对自营贷款与交易的依赖更低。"
    },
    roles: {
      en: "Investment Banking Analyst, M&A Analyst, Restructuring Analyst, Capital Advisory Analyst",
      zh: "投资银行分析师、并购分析师、重组分析师、资本顾问分析师"
    },
    process: {
      en: "Application → technical screen → interviews → final round; modeling and deal discussion are common.",
      zh: "申请 → 技术筛选 → 面试 → 终面；通常包含建模与交易讨论。"
    },
    prepare: {
      en: "Build merger models, valuation and restructuring fundamentals, and be able to defend a transaction thesis concisely.",
      zh: "准备并购模型、估值与重组基础，并能简洁有力地论证交易逻辑。"
    },
    watch: {
      en: "Teams are smaller and senior exposure can be high; confirm the specific coverage group and office.",
      zh: "团队规模通常较小、与资深银行家的接触可能较多；应确认具体行业组与办公室。"
    },
    careers: "https://www.evercore.com/careers/"
  },
  {
    id: "blackstone",
    initials: "BX",
    name: "Blackstone",
    region: "americas",
    type: { en: "Alternative asset management", zh: "另类资产管理" },
    location: { en: "New York / Global", zh: "纽约 / 全球" },
    sectors: {
      en: ["Private equity", "Real estate", "Credit", "Hedge fund solutions"],
      zh: ["私募股权", "房地产", "信用", "对冲基金解决方案"]
    },
    description: {
      en: "A global alternative asset manager spanning private equity, real estate, credit, infrastructure and hedge fund solutions. Its scale connects institutional capital with long-duration private assets.",
      zh: "一家全球另类资产管理机构，业务覆盖私募股权、房地产、信用、基础设施及对冲基金解决方案，连接机构资本与长期私募资产。"
    },
    lens: {
      en: "A major reference for private markets, real-asset ownership and the operating work required after an investment is made.",
      zh: "理解私募市场、实物资产所有权及投资后运营工作的重要参照。"
    },
    roles: {
      en: "Private Equity Analyst, Real Estate Analyst, Credit Analyst, Portfolio Operations Analyst, Investor Relations Analyst",
      zh: "私募股权分析师、房地产分析师、信用分析师、投后运营分析师、投资者关系分析师"
    },
    process: {
      en: "Application → modeling or case assessment → interviews → team discussions; process varies by business.",
      zh: "申请 → 建模或案例测评 → 面试 → 团队交流；不同业务流程不同。"
    },
    prepare: {
      en: "Prepare LBOs, real-asset analysis, debt structures and value-creation cases. Show commercial judgment beyond spreadsheet mechanics.",
      zh: "准备 LBO、实物资产分析、债务结构与价值创造案例，并展示超越表格操作层面的商业判断。"
    },
    watch: {
      en: "Private-equity, real-estate and credit roles have distinct investment processes and hiring expectations.",
      zh: "私募股权、房地产与信用岗位拥有不同的投资流程和招聘要求。"
    },
    careers: "https://www.blackstone.com/careers/"
  },
  {
    id: "rothschild-and-co",
    initials: "R&Co",
    name: "Rothschild & Co",
    region: "europe",
    type: { en: "Independent financial advisory", zh: "独立金融顾问" },
    location: { en: "Paris / London / Global", zh: "巴黎 / 伦敦 / 全球" },
    sectors: {
      en: ["M&A", "Financing advisory", "Wealth", "Merchant banking"],
      zh: ["并购", "融资顾问", "财富管理", "商人银行"]
    },
    description: {
      en: "A family-controlled independent advisory group with M&A, financing, wealth and merchant-banking activities. Its European roots and global network make it a useful cross-border advisory case.",
      zh: "一家家族控股的独立顾问集团，业务覆盖并购、融资、财富管理与商人银行，其欧洲根基与全球网络提供了跨境顾问业务的重要案例。"
    },
    lens: {
      en: "A useful view of relationship-led advisory, cross-border transactions and long-term family-capital perspectives.",
      zh: "理解关系驱动型顾问、跨境交易与长期家族资本视角的重要窗口。"
    },
    roles: {
      en: "M&A Analyst, Debt Advisory Analyst, Equity Advisory Analyst, Wealth Analyst",
      zh: "并购分析师、债务顾问分析师、股权顾问分析师、财富分析师"
    },
    process: {
      en: "Application → tests → interviews → final round; local offices may use different formats.",
      zh: "申请 → 测试 → 面试 → 终面；不同地区办公室可能采用不同形式。"
    },
    prepare: {
      en: "Practice valuation, M&A process and cross-border reasoning. French or other European languages can be useful in specific offices.",
      zh: "训练估值、并购流程与跨境推理。部分办公室可能看重法语或其他欧洲语言。"
    },
    watch: {
      en: "Advisory, wealth and merchant-banking businesses recruit separately and may have different timelines.",
      zh: "顾问、财富管理与商人银行业务分别招聘，时间线可能不同。"
    },
    careers: "https://www.rothschildandco.com/en/careers/"
  },
  {
    id: "barclays",
    initials: "BARC",
    name: "Barclays",
    region: "europe",
    type: { en: "Global banking & markets", zh: "全球银行与市场" },
    location: { en: "London / New York / Global", zh: "伦敦 / 纽约 / 全球" },
    sectors: {
      en: ["Investment banking", "Markets", "Corporate banking", "Consumer banking"],
      zh: ["投资银行", "金融市场", "公司银行", "消费金融"]
    },
    description: {
      en: "A British universal bank with investment banking, markets, corporate and consumer businesses. Its transatlantic franchise provides a useful comparison between European and US capital markets.",
      zh: "一家英国综合银行，业务覆盖投资银行、金融市场、公司与消费金融。其跨大西洋业务有助于比较欧洲与美国资本市场。"
    },
    lens: {
      en: "A useful view of cross-border banking, market financing and the relationship between institutional and consumer businesses.",
      zh: "理解跨境银行、市场融资以及机构与消费业务关系的重要视角。"
    },
    roles: {
      en: "Investment Banking Analyst, Markets Analyst, Corporate Banking Analyst, Risk Analyst, Treasury Analyst",
      zh: "投资银行分析师、市场分析师、公司银行分析师、风险分析师、资金分析师"
    },
    process: {
      en: "Application → online assessment → interviews → assessment centre or final round.",
      zh: "申请 → 在线测评 → 面试 → 评估中心或终面。"
    },
    prepare: {
      en: "Prepare valuation, markets and credit fundamentals, plus a clear understanding of the division and office.",
      zh: "准备估值、市场与信用基础，并清楚理解所申请的业务线与办公室。"
    },
    watch: {
      en: "Programs vary across London, New York and regional offices; verify the exact business and location.",
      zh: "伦敦、纽约及地区办公室的招聘项目不同，应核实具体业务与地点。"
    },
    careers: "https://home.barclays/careers/"
  },
  {
    id: "schroders",
    initials: "SDR",
    name: "Schroders",
    region: "europe",
    type: { en: "Global asset management", zh: "全球资产管理" },
    location: { en: "London / Global", zh: "伦敦 / 全球" },
    sectors: {
      en: ["Asset management", "Private markets", "Wealth", "Solutions"],
      zh: ["资产管理", "私募市场", "财富管理", "解决方案"]
    },
    description: {
      en: "A global investment manager with active public markets, private markets, wealth and solutions capabilities. Its long history offers a useful view of active asset management and client advisory.",
      zh: "一家全球投资管理机构，具备主动公开市场、私募市场、财富管理与解决方案能力，其长期历史有助于理解主动资产管理与客户顾问业务。"
    },
    lens: {
      en: "A useful case in active research, long-term investing and the commercial realities of asset gathering.",
      zh: "理解主动研究、长期投资与资产管理商业现实的有用案例。"
    },
    roles: {
      en: "Equity Research Analyst, Fixed Income Analyst, Portfolio Analyst, Client Solutions Analyst",
      zh: "股票研究分析师、固定收益分析师、组合分析师、客户解决方案分析师"
    },
    process: {
      en: "Application → online assessment → interviews → assessment centre or final round.",
      zh: "申请 → 在线测评 → 面试 → 评估中心或终面。"
    },
    prepare: {
      en: "Prepare a stock or bond thesis, portfolio construction and clear client communication.",
      zh: "准备股票或债券观点、组合构建以及清晰的客户沟通。"
    },
    watch: {
      en: "Public markets, private markets and wealth teams may use different recruiting processes.",
      zh: "公开市场、私募市场与财富团队可能采用不同招聘流程。"
    },
    careers: "https://www.schroders.com/en/global/individual/careers/"
  },
  {
    id: "smbc",
    initials: "SMBC",
    name: "SMBC Group",
    region: "asia",
    type: { en: "Japanese banking group", zh: "日本银行集团" },
    location: { en: "Tokyo / Global", zh: "东京 / 全球" },
    sectors: {
      en: ["Corporate banking", "Global markets", "Aviation finance", "Leasing"],
      zh: ["公司银行", "全球市场", "航空金融", "租赁"]
    },
    description: {
      en: "A Japanese banking group with corporate lending, global markets, structured finance and leasing businesses. Its international network connects Japanese and global corporate clients.",
      zh: "一家日本银行集团，业务包括企业贷款、全球市场、结构融资与租赁，其国际网络连接日本与全球企业客户。"
    },
    lens: {
      en: "A strong view of relationship banking, structured finance and the role of Japanese capital in global projects.",
      zh: "理解关系银行、结构融资以及日本资本在全球项目中作用的重要视角。"
    },
    roles: {
      en: "Corporate Banking Analyst, Structured Finance Analyst, Markets Analyst, Credit Analyst, Risk Analyst",
      zh: "公司银行分析师、结构融资分析师、市场分析师、信用分析师、风险分析师"
    },
    process: {
      en: "Application → online tests → interviews → final round; Japanese and international programs may differ.",
      zh: "申请 → 在线测试 → 面试 → 终面；日本与国际项目可能不同。"
    },
    prepare: {
      en: "Build credit and structured-finance fundamentals, plus a clear view of Japan-linked cross-border capital flows.",
      zh: "建立信用与结构融资基础，并形成对日本相关跨境资本流动的清晰观点。"
    },
    watch: {
      en: "Confirm language, location and work-authorization requirements for the specific office.",
      zh: "应核实具体办公室的语言、地点与工作资格要求。"
    },
    careers: "https://www.smbc.co.jp/global/"
  }
];

const careerData = [
  {
    id: "investment-banking",
    division: { en: "Investment Banking", zh: "投资银行" },
    title: { en: "Investment Banking Analyst", zh: "投资银行分析师" },
    summary: {
      en: "Builds models, prepares transaction materials and supports live deal execution across M&A and capital markets.",
      zh: "构建模型、制作交易材料，并支持并购与资本市场项目的现场执行。"
    },
    skills: { en: "Accounting · Valuation · PowerPoint · Deal process", zh: "会计 · 估值 · 演示材料 · 交易流程" },
    firms: { en: "JPMorgan · Goldman Sachs · Morgan Stanley · CICC", zh: "摩根大通 · 高盛 · 摩根士丹利 · 中金" }
  },
  {
    id: "m-and-a",
    division: { en: "M&A Advisory", zh: "并购顾问" },
    title: { en: "M&A Analyst", zh: "并购分析师" },
    summary: {
      en: "Analyzes acquisition targets, synergy cases and valuation scenarios for strategic buyers or sellers.",
      zh: "为战略买方或卖方分析收购标的、协同效应与估值情景。"
    },
    skills: { en: "Financial modeling · Strategic analysis · Negotiation", zh: "财务建模 · 战略分析 · 谈判" },
    firms: { en: "Goldman Sachs · Morgan Stanley · UBS · BNP Paribas", zh: "高盛 · 摩根士丹利 · 瑞银 · 法国巴黎银行" }
  },
  {
    id: "sales-and-trading",
    division: { en: "Markets", zh: "金融市场" },
    title: { en: "Sales & Trading Analyst", zh: "销售与交易分析师" },
    summary: {
      en: "Supports client flow, market analysis and trade ideas across equities, rates, credit, FX or commodities.",
      zh: "支持股票、利率、信用、外汇或大宗商品领域的客户交易流、市场分析与交易观点。"
    },
    skills: { en: "Market awareness · Probability · Risk · Communication", zh: "市场认知 · 概率 · 风险 · 沟通" },
    firms: { en: "JPMorgan · Goldman Sachs · Nomura · UBS", zh: "摩根大通 · 高盛 · 野村 · 瑞银" }
  },
  {
    id: "equity-research",
    division: { en: "Equity Research", zh: "股票研究" },
    title: { en: "Equity Research Associate", zh: "股票研究助理" },
    summary: {
      en: "Builds industry and company models, tracks earnings and produces investment recommendations.",
      zh: "构建行业与公司模型、跟踪盈利变化，并形成投资建议。"
    },
    skills: { en: "Industry analysis · Earnings models · Writing", zh: "行业分析 · 盈利模型 · 写作" },
    firms: { en: "Morgan Stanley · Nomura · UBS · CICC", zh: "摩根士丹利 · 野村 · 瑞银 · 中金" }
  },
  {
    id: "asset-management",
    division: { en: "Asset Management", zh: "资产管理" },
    title: { en: "Asset Management Analyst", zh: "资产管理分析师" },
    summary: {
      en: "Supports portfolio research, asset allocation, manager due diligence or client investment solutions.",
      zh: "支持组合研究、资产配置、管理人尽调或客户投资解决方案。"
    },
    skills: { en: "Portfolio theory · Research · Client solutions", zh: "组合理论 · 研究 · 客户解决方案" },
    firms: { en: "JPMorgan · Morgan Stanley · UBS · Man Group", zh: "摩根大通 · 摩根士丹利 · 瑞银 · 英仕曼" }
  },
  {
    id: "quant-research",
    division: { en: "Quantitative Research", zh: "量化研究" },
    title: { en: "Quantitative Researcher", zh: "量化研究员" },
    summary: {
      en: "Tests market hypotheses, constructs signals and validates systematic strategies with rigorous out-of-sample evidence.",
      zh: "检验市场假设、构建信号，并用严谨的样本外证据验证系统性策略。"
    },
    skills: { en: "Probability · Statistics · Programming · Research", zh: "概率 · 统计 · 编程 · 研究" },
    firms: { en: "Jane Street · Citadel · Two Sigma · Man Group", zh: "Jane Street · Citadel · Two Sigma · 英仕曼" }
  },
  {
    id: "market-risk",
    division: { en: "Risk Management", zh: "风险管理" },
    title: { en: "Market Risk Analyst", zh: "市场风险分析师" },
    summary: {
      en: "Monitors exposures, designs risk scenarios and challenges trading or portfolio decisions independently.",
      zh: "监控风险敞口、设计风险情景，并独立挑战交易或组合决策。"
    },
    skills: { en: "Risk metrics · Scenarios · Product knowledge", zh: "风险指标 · 情景分析 · 产品知识" },
    firms: { en: "JPMorgan · UBS · BNP Paribas · Nomura", zh: "摩根大通 · 瑞银 · 法国巴黎银行 · 野村" }
  },
  {
    id: "compliance",
    division: { en: "Compliance", zh: "合规" },
    title: { en: "Compliance Analyst", zh: "合规分析师" },
    summary: {
      en: "Interprets regulation, monitors conduct and works with business teams to design effective controls.",
      zh: "解释监管要求、监督业务行为，并与业务团队共同设计有效控制措施。"
    },
    skills: { en: "Regulation · Legal reasoning · Controls · Ethics", zh: "监管 · 法律推理 · 控制 · 伦理" },
    firms: { en: "Goldman Sachs · UBS · BNP Paribas · DBS", zh: "高盛 · 瑞银 · 法国巴黎银行 · 星展" }
  },
  {
    id: "financial-technology",
    division: { en: "Financial Technology", zh: "金融科技" },
    title: { en: "Financial Technology Analyst", zh: "金融科技分析师" },
    summary: {
      en: "Translates financial workflows into reliable data products, software systems or digital client journeys.",
      zh: "将金融工作流转化为可靠的数据产品、软件系统或数字化客户体验。"
    },
    skills: { en: "Data · Systems · Product thinking · Python or SQL", zh: "数据 · 系统 · 产品思维 · Python 或 SQL" },
    firms: { en: "Two Sigma · LSEG · JPMorgan · DBS", zh: "Two Sigma · 伦交所集团 · 摩根大通 · 星展" }
  },
  {
    id: "corporate-banking",
    division: { en: "Corporate Banking", zh: "公司银行" },
    title: { en: "Corporate Banking Analyst", zh: "公司银行分析师" },
    summary: {
      en: "Assesses corporate credit needs, structures lending and coordinates banking products for clients.",
      zh: "评估企业信用需求、设计贷款结构，并为客户协调银行产品。"
    },
    skills: { en: "Credit analysis · Relationship management · Lending", zh: "信用分析 · 客户关系 · 贷款" },
    firms: { en: "JPMorgan · BNP Paribas · MUFG · DBS", zh: "摩根大通 · 法国巴黎银行 · 三菱日联 · 星展" }
  },
  {
    id: "private-equity",
    division: { en: "Private Capital", zh: "私募资本" },
    title: { en: "Private Equity Analyst", zh: "私募股权分析师" },
    summary: {
      en: "Screens investments, builds operating and returns models, and supports diligence on private companies.",
      zh: "筛选投资项目、构建经营与回报模型，并支持对非上市公司的尽职调查。"
    },
    skills: { en: "LBO modeling · Due diligence · Industry research", zh: "LBO 建模 · 尽职调查 · 行业研究" },
    firms: { en: "Global investment banks · Private-capital firms", zh: "全球投资银行 · 私募资本机构" }
  },
  {
    id: "treasury",
    division: { en: "Treasury", zh: "资金管理" },
    title: { en: "Treasury Analyst", zh: "资金分析师" },
    summary: {
      en: "Manages liquidity, funding, balance-sheet usage and interest-rate or FX exposure for a financial institution.",
      zh: "管理金融机构的流动性、融资、资产负债表使用及利率或外汇敞口。"
    },
    skills: { en: "Liquidity · Funding · Interest rates · FX", zh: "流动性 · 融资 · 利率 · 外汇" },
    firms: { en: "JPMorgan · Morgan Stanley · MUFG · DBS", zh: "摩根大通 · 摩根士丹利 · 三菱日联 · 星展" }
  }
];

const careerPlaybooks = {
  "investment-banking": {
    overview: {
      en: "An IBD analyst supports live transactions and pitch work. The role combines financial analysis, document production, client communication and process coordination under tight deadlines.",
      zh: "投资银行部分析师同时支持在途交易与项目推介。这份工作需要在紧迫时限下完成财务分析、材料制作、客户沟通与流程协调。"
    },
    work: {
      en: [
        "Build and update three-statement models, DCFs, trading comparables and transaction comparables.",
        "Prepare pitch books, management presentations, board materials and internal approval documents.",
        "Coordinate diligence, data rooms and workstreams across legal, accounting and industry advisers.",
        "Respond to last-minute information requests while keeping model versions and deal records accurate."
      ],
      zh: [
        "构建并更新三表模型、DCF、可比公司及可比交易分析。",
        "制作推介材料、管理层演示、董事会材料与内部审批文件。",
        "协调法律、会计与行业顾问之间的尽调、数据室和任务流。",
        "应对临时信息需求，同时保持模型版本与交易记录准确。"
      ]
    },
    chain: {
      en: ["Pitch & sourcing", "Mandate", "Diligence & modeling", "Committee materials", "Execution & close"],
      zh: ["推介与项目来源", "获得委托", "尽调与建模", "委员会材料", "执行与交割"]
    },
    prepare: {
      en: [
        "Master links between income statement, balance sheet and cash flow.",
        "Practice valuation bridges and explain why multiples differ.",
        "Prepare one deal story with strategic rationale, valuation and risks."
      ],
      zh: [
        "掌握利润表、资产负债表与现金流量表之间的联动。",
        "练习估值桥，并能解释不同倍数差异的来源。",
        "准备一段包含战略逻辑、估值与风险的并购交易案例。"
      ]
    },
    questions: {
      en: [
        "Walk me through a DCF. What assumptions move the value most?",
        "Why would an acquirer pay a premium above the trading price?"
      ],
      zh: [
        "请讲解 DCF 的主要步骤，哪些假设对估值影响最大？",
        "收购方为什么可能支付高于当前股价的溢价？"
      ]
    }
  },
  "m-and-a": {
    overview: {
      en: "An M&A analyst evaluates strategic combinations, acquisition economics and transaction risks. The work supports negotiation and board-level decisions rather than routine trading.",
      zh: "并购分析师评估战略整合、收购经济性与交易风险，工作直接支持谈判和管理层决策，而非日常交易执行。"
    },
    work: {
      en: [
        "Screen targets and map strategic fit, ownership, valuation and potential transaction constraints.",
        "Build merger models, synergy cases and accretion/dilution analysis.",
        "Support commercial and financial diligence, management meetings and negotiation materials.",
        "Track comparable transactions, market activity and regulatory considerations."
      ],
      zh: [
        "筛选标的并分析战略匹配度、股权结构、估值与潜在交易约束。",
        "构建并购模型、协同效应情景与增厚/摊薄分析。",
        "支持商业和财务尽调、管理层会议与谈判材料。",
        "跟踪可比交易、市场动态及监管因素。"
      ]
    },
    chain: {
      en: ["Target mapping", "Strategic screen", "Valuation & synergy case", "Diligence & negotiation", "Signing & integration"],
      zh: ["标的全景", "战略筛选", "估值与协同分析", "尽调与谈判", "签约与整合"]
    },
    prepare: {
      en: [
        "Understand purchase price allocation, sources and uses, and merger accounting basics.",
        "Practice explaining revenue versus cost synergies and what makes them credible.",
        "Track one recent deal and form a view on price, rationale and execution risk."
      ],
      zh: [
        "理解购买价格分配、资金来源与用途及基础并购会计。",
        "练习区分收入协同与成本协同，并解释其可信依据。",
        "跟踪一笔近期交易，形成关于价格、逻辑和执行风险的观点。"
      ]
    },
    questions: {
      en: [
        "When is an acquisition accretive but still a bad deal?",
        "How would you test whether projected synergies are credible?"
      ],
      zh: [
        "一项收购在报表上增厚，为什么仍可能是一笔坏交易？",
        "你会如何检验预测协同效应是否可信？"
      ]
    }
  },
  "sales-and-trading": {
    overview: {
      en: "A sales and trading analyst works between clients, markets and risk. The role requires fast market synthesis, accurate execution and disciplined risk awareness.",
      zh: "销售与交易分析师处于客户、市场与风险之间，需要快速形成市场判断、准确执行交易并保持严格的风险意识。"
    },
    work: {
      en: [
        "Prepare morning market briefs covering overnight moves, catalysts and positioning.",
        "Price quotes, support client orders and communicate relevant market color.",
        "Monitor inventory, P&L and risk limits throughout the trading day.",
        "Produce post-trade recaps and improve repeatable market-analysis frameworks."
      ],
      zh: [
        "准备晨间市场简报，覆盖隔夜走势、催化剂与仓位变化。",
        "协助报价、处理客户订单并传递相关市场信息。",
        "盘中持续监控库存、盈亏与风险限额。",
        "完成盘后复盘，并持续改进可重复使用的市场分析框架。"
      ]
    },
    chain: {
      en: ["Pre-market prep", "Client dialogue", "Pricing & execution", "Risk management", "Post-trade review"],
      zh: ["盘前准备", "客户沟通", "定价与执行", "风险管理", "盘后复盘"]
    },
    prepare: {
      en: [
        "Practice mental math, expected value and quick probability updates.",
        "Prepare a two-minute trade idea with catalyst, risk and exit discipline.",
        "Know what moves rates, credit, FX and major equity sectors."
      ],
      zh: [
        "练习心算、期望值与快速概率更新。",
        "准备一段两分钟交易观点，包含催化剂、风险与退出纪律。",
        "理解利率、信用、外汇与主要股票板块的驱动因素。"
      ]
    },
    questions: {
      en: [
        "Give me a trade idea. What is your downside and when do you exit?",
        "A client wants liquidity in an illiquid product. What do you consider?"
      ],
      zh: [
        "给我一个交易观点：下行风险是什么，何时退出？",
        "客户想交易流动性较差的产品，你会考虑什么？"
      ]
    }
  },
  "equity-research": {
    overview: {
      en: "An equity research associate covers a sector and company set, combining data, industry work and judgment to produce a publishable investment view.",
      zh: "股票研究助理覆盖特定行业与公司，将数据、行业研究与判断结合，形成可发布的投资观点。"
    },
    work: {
      en: [
        "Maintain earnings models and update forecasts after company disclosures or industry changes.",
        "Conduct channel checks, expert calls and analysis of filings and competitors.",
        "Write initiation notes, earnings reviews and investment recommendations.",
        "Present the thesis to sales, traders and institutional clients."
      ],
      zh: [
        "维护盈利模型，并在公司公告或行业变化后更新预测。",
        "开展渠道调研、专家访谈及公告和竞争对手分析。",
        "撰写首次覆盖、财报点评与投资建议。",
        "向销售、交易员与机构客户讲解研究观点。"
      ]
    },
    chain: {
      en: ["Coverage map", "Data & channel checks", "Forecast & valuation", "Publish thesis", "Monitor & revise"],
      zh: ["覆盖图谱", "数据与渠道调研", "预测与估值", "发布观点", "跟踪与修正"]
    },
    prepare: {
      en: [
        "Build a three-statement model and a defensible price target.",
        "Prepare a stock pitch with variant perception and falsifiable catalysts.",
        "Practice writing a one-page thesis with charts that each make one point."
      ],
      zh: [
        "搭建三表模型并形成可辩护的目标价。",
        "准备股票推荐，明确市场分歧与可验证的催化剂。",
        "练习用一页纸完成观点，并让每张图只表达一个结论。"
      ]
    },
    questions: {
      en: [
        "Pitch a stock. What does the market misunderstand?",
        "What would make you change your rating?"
      ],
      zh: [
        "推荐一只股票：市场误解了什么？",
        "什么情况会让你改变评级？"
      ]
    }
  },
  "asset-management": {
    overview: {
      en: "Asset management analysts help allocate capital across assets, sectors or managers. Work blends research, portfolio construction and communication with client objectives.",
      zh: "资产管理分析师帮助在不同资产、行业或管理人之间配置资本，工作结合研究、组合构建与客户目标沟通。"
    },
    work: {
      en: [
        "Analyze asset-class returns, valuations and macro regimes for allocation decisions.",
        "Evaluate securities, funds or external managers through performance and risk analysis.",
        "Build portfolio scenarios, rebalancing cases and investment committee materials.",
        "Monitor portfolios and explain performance, risk and positioning to clients."
      ],
      zh: [
        "分析资产类别收益、估值与宏观状态，为配置决策提供依据。",
        "通过业绩与风险分析评估证券、基金或外部管理人。",
        "构建组合情景、再平衡方案与投资委员会材料。",
        "监控组合，并向客户解释业绩、风险与仓位。"
      ]
    },
    chain: {
      en: ["Client objectives", "Macro & asset research", "Portfolio construction", "Risk monitoring", "Reporting & rebalance"],
      zh: ["客户目标", "宏观与资产研究", "组合构建", "风险监控", "报告与再平衡"]
    },
    prepare: {
      en: [
        "Understand strategic versus tactical allocation and diversification limits.",
        "Practice explaining volatility, drawdown and tracking error to non-specialists.",
        "Prepare a portfolio recommendation for a stated objective and constraint."
      ],
      zh: [
        "理解战略配置、战术配置与分散化限制。",
        "练习向非专业客户解释波动率、回撤与跟踪误差。",
        "针对明确目标与约束准备一套组合配置建议。"
      ]
    },
    questions: {
      en: [
        "How would you allocate a portfolio for a client with a long horizon but low risk tolerance?",
        "When does diversification stop protecting a portfolio?"
      ],
      zh: [
        "客户投资期限长但风险承受力低，你会如何配置组合？",
        "分散化在什么情况下会失去保护作用？"
      ]
    }
  },
  "quant-research": {
    overview: {
      en: "Quantitative researchers convert market hypotheses into measurable signals and production-ready strategies. Success depends on both statistical rigor and economic reasoning.",
      zh: "量化研究员将市场假设转化为可衡量信号与可上线策略，成功同时依赖统计严谨性与经济逻辑。"
    },
    work: {
      en: [
        "Form market hypotheses and define data, targets and evaluation metrics.",
        "Engineer features, run experiments and test signals against realistic frictions.",
        "Check overfitting, leakage, regime dependence and capacity constraints.",
        "Work with engineers and traders to deploy, monitor and retire strategies."
      ],
      zh: [
        "形成市场假设，并定义数据、目标与评估指标。",
        "构建特征、运行实验，并在真实交易摩擦下检验信号。",
        "检查过拟合、数据泄漏、市场状态依赖与容量约束。",
        "与工程师和交易员合作部署、监控并淘汰策略。"
      ]
    },
    chain: {
      en: ["Hypothesis", "Data & feature design", "Experiment", "Robustness & cost check", "Deploy & monitor"],
      zh: ["提出假设", "数据与特征设计", "实验验证", "稳健性与成本检验", "部署与监控"]
    },
    prepare: {
      en: [
        "Practice probability, statistics and clean coding under time pressure.",
        "Be able to audit a backtest for look-ahead bias and multiple testing.",
        "Explain the economic mechanism behind a signal, not only its Sharpe ratio."
      ],
      zh: [
        "在限时条件下练习概率、统计与整洁编程。",
        "能够检查回测中的前视偏差与多重检验问题。",
        "解释信号背后的经济机制，而不只展示夏普比率。"
      ]
    },
    questions: {
      en: [
        "You find a high Sharpe signal. How do you decide whether it is real?",
        "Estimate the expected value of a simple betting game and explain your assumptions."
      ],
      zh: [
        "你发现一个高夏普信号，如何判断它是真实的？",
        "估算一个简单博弈的期望值，并说明你的假设。"
      ]
    }
  },
  "market-risk": {
    overview: {
      en: "Market risk analysts measure and challenge exposures across trading and investment portfolios. The role requires product knowledge, quantitative discipline and independent judgment.",
      zh: "市场风险分析师衡量并挑战交易与投资组合的风险敞口，需要产品知识、量化纪律与独立判断。"
    },
    work: {
      en: [
        "Monitor VaR, sensitivities, stress loss and limit utilization across desks.",
        "Design scenarios for rate shocks, volatility moves, credit spreads and liquidity stress.",
        "Review new products and trading strategies for hidden or concentrated risks.",
        "Escalate limit breaches and communicate risk changes to senior stakeholders."
      ],
      zh: [
        "监控各交易台的 VaR、敏感性、压力损失与限额使用。",
        "设计利率冲击、波动率变化、信用利差与流动性压力情景。",
        "审查新产品和交易策略中的隐性或集中风险。",
        "上报限额突破，并向高级管理层沟通风险变化。"
      ]
    },
    chain: {
      en: ["Identify exposure", "Measure", "Set limits", "Monitor & challenge", "Escalate & remediate"],
      zh: ["识别敞口", "计量风险", "设定限额", "监控与挑战", "上报与整改"]
    },
    prepare: {
      en: [
        "Know duration, convexity, Greeks, VaR and basic stress testing.",
        "Practice challenging a trade respectfully and supporting the challenge with evidence.",
        "Understand how liquidity and correlation can break during stress."
      ],
      zh: [
        "掌握久期、凸性、希腊字母、VaR 与基础压力测试。",
        "练习有礼有据地挑战交易观点。",
        "理解压力情景下流动性与相关性为何可能失效。"
      ]
    },
    questions: {
      en: [
        "Rates rise sharply overnight. How do you assess portfolio impact?",
        "A desk is inside its VaR limit but concentrations are rising. What do you do?"
      ],
      zh: [
        "利率 overnight 大幅上升，你会如何评估组合影响？",
        "交易台未突破 VaR 限额但集中度持续上升，你会怎么做？"
      ]
    }
  },
  compliance: {
    overview: {
      en: "Compliance analysts translate regulation into practical controls. They advise the business, monitor conduct and investigate potential breaches without owning commercial P&L.",
      zh: "合规分析师将监管要求转化为可执行控制，为业务提供建议、监控行为并调查潜在违规，同时不承担商业盈亏责任。"
    },
    work: {
      en: [
        "Map regulations and internal policies to business processes and control points.",
        "Review communications, transactions and conflicts for potential policy issues.",
        "Investigate alerts, document findings and coordinate remediation.",
        "Advise deal teams and deliver targeted compliance training."
      ],
      zh: [
        "将监管要求与内部政策映射到业务流程和控制节点。",
        "审查沟通、交易与利益冲突中的潜在政策问题。",
        "调查预警、记录结论并协调整改。",
        "为交易团队提供建议，并开展有针对性的合规培训。"
      ]
    },
    chain: {
      en: ["Regulatory mapping", "Risk assessment", "Surveillance", "Investigation", "Advice & remediation"],
      zh: ["监管映射", "风险评估", "行为监控", "调查", "建议与整改"]
    },
    prepare: {
      en: [
        "Understand insider trading, conflicts, market abuse and information barriers.",
        "Practice ethical judgment when commercial pressure conflicts with policy.",
        "Show that you can explain rules without simply quoting them."
      ],
      zh: [
        "理解内幕交易、利益冲突、市场滥用与信息隔离。",
        "练习在商业压力与政策冲突时作出伦理判断。",
        "展示你能够解释规则逻辑，而不只是引用条文。"
      ]
    },
    questions: {
      en: [
        "A senior banker wants an exception to a control. How do you respond?",
        "What does a trade-surveillance alert actually prove—and what does it not prove?"
      ],
      zh: [
        "资深银行家希望绕过一项控制，你会如何回应？",
        "交易监控预警能够证明什么，又不能证明什么？"
      ]
    }
  },
  "financial-technology": {
    overview: {
      en: "Financial technology analysts connect financial processes, data and software. They make workflows faster, more reliable and easier to control.",
      zh: "金融科技分析师连接金融流程、数据与软件，让工作流更快速、更可靠且更易控制。"
    },
    work: {
      en: [
        "Gather requirements from traders, risk, operations or client teams.",
        "Map data flows and define controls, edge cases and reconciliation logic.",
        "Build prototypes, SQL analyses or production services with engineering teams.",
        "Test releases, monitor incidents and improve platform reliability."
      ],
      zh: [
        "向交易、风险、运营或客户团队收集需求。",
        "梳理数据流，定义控制、边界情况与对账逻辑。",
        "与工程团队共同构建原型、SQL 分析或生产服务。",
        "测试发布、监控事件并提升平台可靠性。"
      ]
    },
    chain: {
      en: ["Business requirement", "Data mapping", "Design", "Build & test", "Deploy & monitor"],
      zh: ["业务需求", "数据映射", "方案设计", "开发与测试", "上线与监控"]
    },
    prepare: {
      en: [
        "Practice SQL, Python and basic system-design communication.",
        "Prepare an example of translating a messy process into a clear product requirement.",
        "Understand financial data quality issues such as duplicates, timing and reference data."
      ],
      zh: [
        "练习 SQL、Python 与基础系统设计表达。",
        "准备一个将混乱流程转化为清晰产品需求的案例。",
        "理解重复、时间戳与参考数据等金融数据质量问题。"
      ]
    },
    questions: {
      en: [
        "Two systems show different positions for the same trade. How do you investigate?",
        "How would you prioritize fixes when every business user says their issue is urgent?"
      ],
      zh: [
        "同一笔交易在两个系统中显示不同持仓，你会如何排查？",
        "当所有业务用户都说自己的问题最紧急时，你如何排序？"
      ]
    }
  },
  "corporate-banking": {
    overview: {
      en: "Corporate banking analysts support lending and banking relationships for companies. The role balances credit quality, client needs, pricing and long-term relationship value.",
      zh: "公司银行分析师支持企业贷款与银行关系，在工作同时平衡信用质量、客户需求、定价与长期关系价值。"
    },
    work: {
      en: [
        "Analyze company financials, cash flow, leverage and repayment capacity.",
        "Prepare credit applications, industry reviews and covenant structures.",
        "Coordinate treasury, trade finance, FX and capital-markets products for clients.",
        "Monitor annual reviews, covenant compliance and early warning signs."
      ],
      zh: [
        "分析企业财务、现金流、杠杆与偿债能力。",
        "准备授信申请、行业分析与契约结构。",
        "为客户协调资金、贸易金融、外汇与资本市场产品。",
        "监控年度审查、财务契约合规与风险预警信号。"
      ]
    },
    chain: {
      en: ["Client need", "Credit analysis", "Structure & pricing", "Approval & documentation", "Monitoring"],
      zh: ["客户需求", "信用分析", "结构与定价", "审批与文件", "贷后监控"]
    },
    prepare: {
      en: [
        "Practice cash-flow and leverage analysis from financial statements.",
        "Understand how covenants and collateral affect lender protection.",
        "Prepare a client-first answer that still protects bank risk."
      ],
      zh: [
        "练习从财务报表分析现金流与杠杆。",
        "理解契约与担保如何影响贷款人保护。",
        "准备既以客户为中心、又能保护银行风险的方案。"
      ]
    },
    questions: {
      en: [
        "Would you lend to a profitable company with weak cash conversion? Why?",
        "A client breaches a covenant but asks for more liquidity. What do you do?"
      ],
      zh: [
        "一家盈利但现金转化较差的公司，你会放贷吗？为什么？",
        "客户违反财务契约却申请更多流动性，你会怎么做？"
      ]
    }
  },
  "private-equity": {
    overview: {
      en: "Private equity analysts evaluate and own illiquid investments. The job extends beyond modeling into industry diligence, value creation and portfolio monitoring.",
      zh: "私募股权分析师评估并持有非流动性投资，工作不仅包括建模，还涵盖行业尽调、价值创造与投后监控。"
    },
    work: {
      en: [
        "Screen companies, markets and potential exit routes.",
        "Build LBO and operating models, returns cases and diligence findings.",
        "Evaluate management, customers, unit economics and downside scenarios.",
        "Support investment committee and portfolio value-creation projects."
      ],
      zh: [
        "筛选公司、市场与潜在退出路径。",
        "构建 LBO、经营模型、回报情景与尽调结论。",
        "评估管理层、客户、单位经济性与下行情景。",
        "支持投资委员会及投后价值创造项目。"
      ]
    },
    chain: {
      en: ["Sourcing", "Screening", "Diligence", "Investment committee", "Portfolio & exit"],
      zh: ["项目来源", "初步筛选", "尽职调查", "投资委员会", "投后与退出"]
    },
    prepare: {
      en: [
        "Build an LBO from a blank sheet and explain returns drivers.",
        "Practice identifying non-financial risks that models can miss.",
        "Prepare an investment case with entry price, value-creation plan and exit logic."
      ],
      zh: [
        "从空白开始搭建 LBO，并解释回报驱动因素。",
        "练习识别模型中容易遗漏的非财务风险。",
        "准备包含进入价格、价值创造计划与退出逻辑的投资案例。"
      ]
    },
    questions: {
      en: [
        "What makes a business a good private-equity target beyond low valuation?",
        "How would you improve returns without simply adding leverage?"
      ],
      zh: [
        "除了估值便宜，什么让一家公司成为好的私募股权标的？",
        "如果不单纯增加杠杆，你会如何提高回报？"
      ]
    }
  },
  treasury: {
    overview: {
      en: "Treasury analysts manage funding, liquidity and financial risk for a bank or corporate. The job protects the balance sheet and ensures the institution can meet obligations under stress.",
      zh: "资金分析师为银行或企业管理融资、流动性与金融风险，保护资产负债表，并确保机构在压力下仍能履行义务。"
    },
    work: {
      en: [
        "Forecast cash and collateral needs across legal entities and currencies.",
        "Plan wholesale funding, debt issuance and contingent liquidity buffers.",
        "Manage interest-rate or FX exposure within approved hedging policies.",
        "Monitor liquidity ratios and explain balance-sheet changes to senior management."
      ],
      zh: [
        "预测不同法人主体与币种的现金和抵押品需求。",
        "规划批发融资、债务发行与应急流动性缓冲。",
        "在既定对冲政策内管理利率或外汇敞口。",
        "监控流动性指标，并向高级管理层解释资产负债表变化。"
      ]
    },
    chain: {
      en: ["Forecast", "Funding plan", "Execute & hedge", "Liquidity monitoring", "Reporting"],
      zh: ["现金流预测", "融资计划", "执行与对冲", "流动性监控", "管理报告"]
    },
    prepare: {
      en: [
        "Understand liquidity ratios, funding maturity mismatch and interest-rate sensitivity.",
        "Practice a simple ALM scenario and explain the trade-off between safety and cost.",
        "Know how central-bank and regulatory frameworks influence funding."
      ],
      zh: [
        "理解流动性指标、融资期限错配与利率敏感性。",
        "练习简单资产负债管理情景，并解释安全性与成本之间的权衡。",
        "了解央行与监管框架如何影响融资。"
      ]
    },
    questions: {
      en: [
        "A short-term funding market freezes. What is your first priority?",
        "How would you decide whether to hedge a future interest-rate exposure?"
      ],
      zh: [
        "短期融资市场冻结时，你的第一优先事项是什么？",
        "你会如何决定是否对冲未来利率敞口？"
      ]
    }
  }
};

const questionBank = {
  ibd: [
    {
      question: {
        en: "Walk me through a DCF. Which assumptions matter most?",
        zh: "请讲解 DCF 的主要步骤，哪些假设对估值影响最大？"
      },
      framework: {
        en: "Project operating cash flow, calculate WACC, discount cash flows, estimate terminal value, bridge enterprise to equity value, then test WACC, growth and margin assumptions with a sensitivity table. Name the assumption that drives the business model most.",
        zh: "预测经营现金流，计算 WACC，折现现金流，估算终值，从企业价值推导股权价值，再用敏感性分析检验 WACC、增长率和利润率。最后指出对该商业模式影响最大的关键假设。"
      }
    },
    {
      question: {
        en: "A company reports rising profit but negative free cash flow. What do you investigate?",
        zh: "一家公司利润持续增长但自由现金流为负，你会排查什么？"
      },
      framework: {
        en: "Separate accounting profit from cash generation. Check working-capital build, capex, capitalized costs, growth investment, non-cash items and collection quality. Explain whether the gap is temporary expansion or a sign of weak earnings quality.",
        zh: "先区分会计利润与现金创造。检查营运资金占用、资本开支、资本化成本、增长投入、非现金项目与回款质量，并判断差异来自暂时性扩张还是盈利质量偏弱。"
      }
    },
    {
      question: {
        en: "An acquisition is accretive to EPS. Is it a good deal?",
        zh: "一项收购能够增厚每股收益，它一定是一笔好交易吗？"
      },
      framework: {
        en: "Not necessarily. Test strategic fit, purchase price, synergy credibility, integration risk, financing cost, dilution to existing owners and returns versus organic alternatives. EPS accretion is one output, not the decision rule.",
        zh: "不一定。应检验战略匹配、收购价格、协同可信度、整合风险、融资成本、对原股东的实际稀释，以及与内生增长的回报比较。EPS 增厚只是结果之一，不是决策规则。"
      }
    }
  ],
  markets: [
    {
      question: {
        en: "A game pays $20 with 5% probability and loses $1 otherwise. What is it worth?",
        zh: "一个游戏有 5% 概率赢得 20 美元，否则损失 1 美元，它值多少？"
      },
      framework: {
        en: "Expected payoff is 0.05 × 20 − 0.95 × 1 = $0.05. Then discuss risk capacity, repeated play, bankroll, variance and whether the counterparty is credible. Expected value alone is not a complete trading decision.",
        zh: "期望收益为 0.05×20−0.95×1＝0.05 美元。随后讨论风险容量、重复博弈、资金规模、方差与对手方信用。期望值本身不能构成完整交易决策。"
      }
    },
    {
      question: {
        en: "Rates rise sharply overnight. How do you think through market impact?",
        zh: "利率隔夜大幅上升，你会如何推演市场影响？"
      },
      framework: {
        en: "Start with duration and convexity, then move across curves, equity valuation, credit spreads, FX and funding. Distinguish mark-to-market loss from liquidity pressure, and identify which positions or clients need action first.",
        zh: "先看久期与凸性，再推演曲线、股票估值、信用利差、外汇与融资市场。区分市值损失与流动性压力，并判断哪些仓位或客户需要优先处理。"
      }
    },
    {
      question: {
        en: "A client wants to trade a large position in an illiquid product. What matters?",
        zh: "客户希望交易一笔流动性较差产品的大额仓位，你会考虑什么？"
      },
      framework: {
        en: "Estimate liquidity, price impact, inventory risk and time to exit. Clarify client objectives, urgency and constraints. Consider hedging, pre-arranged liquidity, price concessions and regulatory or suitability requirements.",
        zh: "估算流动性、价格冲击、库存风险与退出所需时间，明确客户目标、紧急程度和约束。考虑对冲、预撮合流动性、价格折让及监管或适当性要求。"
      }
    }
  ],
  quant: [
    {
      question: {
        en: "You find a high Sharpe signal after testing many variants. What could be wrong?",
        zh: "在尝试大量变体后发现一个高夏普信号，可能哪里有问题？"
      },
      framework: {
        en: "Multiple testing can manufacture false discoveries. Check the number of trials, out-of-sample stability, transaction costs, capacity, regime dependence and the economic mechanism. Keep a complete research log and penalize the Sharpe ratio for search intensity.",
        zh: "多重检验容易制造伪发现。检查试验次数、样本外稳定性、交易成本、容量、市场状态依赖和经济机制。保留完整研究日志，并因搜索强度对夏普比率进行惩罚。"
      }
    },
    {
      question: {
        en: "How would you handle missing data in a financial dataset?",
        zh: "你如何处理金融数据中的缺失值？"
      },
      framework: {
        en: "First diagnose why data are missing. Compare complete-case, model-based and forward-fill approaches, prevent look-ahead leakage, and test whether performance depends on imputation choices. Some missingness is information.",
        zh: "先判断缺失机制。比较完整样本、模型填补与前向填充，防止前视偏差，并测试策略表现是否依赖填补方式。某些缺失本身就是信息。"
      }
    },
    {
      question: {
        en: "What evidence tells you a backtest is overfit?",
        zh: "哪些证据说明回测已经过拟合？"
      },
      framework: {
        en: "Look for parameter sensitivity, weak out-of-sample decay, unexplained returns, extreme turnover, narrow data dependence and performance that disappears after realistic costs. Prefer simple, stable signals with an economic story.",
        zh: "检查参数敏感性、样本外衰减、无法解释的收益、极高换手、对狭窄数据源的依赖，以及在真实成本后消失的表现。优先选择简单、稳定且有经济逻辑的信号。"
      }
    }
  ],
  risk: [
    {
      question: {
        en: "A desk is inside its VaR limit, but concentrations are rising. What do you do?",
        zh: "交易台尚未突破 VaR 限额，但集中度持续上升，你会怎么做？"
      },
      framework: {
        en: "Do not treat one risk metric as the complete picture. Review concentration, stress loss, liquidity, correlation and new-product risk. Challenge the assumption set and escalate with a clear request for action.",
        zh: "不能把单一风险指标当作全貌。检查集中度、压力损失、流动性、相关性与新产品风险，挑战原假设，并带着明确行动请求上报。"
      }
    },
    {
      question: {
        en: "A senior colleague asks you to overlook a policy exception. How do you respond?",
        zh: "资深同事要求你忽略一次政策例外，你会如何回应？"
      },
      framework: {
        en: "Clarify the facts and policy first. Explain the risk and available escalation route, then document the request and seek compliance or management guidance. Seniority does not override control responsibilities.",
        zh: "先确认事实与政策，解释风险和可用的上报路径，记录请求并寻求合规或管理层指导。职级不能取代控制责任。"
      }
    },
    {
      question: {
        en: "Your model performs poorly in a stress regime. What next?",
        zh: "模型在压力状态下表现很差，接下来怎么办？"
      },
      framework: {
        en: "Identify which assumptions broke, compare model output with stressed benchmarks, quantify limitations, and restrict use until remediated. Strengthen stress testing and govern any model change with validation.",
        zh: "识别哪些假设失效，与压力基准比较，量化模型局限，并在整改前限制使用。加强压力测试，并通过验证治理模型变更。"
      }
    }
  ]
};

const labDefinitions = [
  {
    id: "compound",
    step: "01",
    title: { en: "A small edge can compound.", zh: "微小优势也会复利。" },
    question: {
      en: "Change the return, volatility and time horizon. When does the direction of the journey stop feeling obvious?",
      zh: "调整收益率、波动率和投资年限。旅程看起来不再那么确定，是从什么时候开始的？"
    },
    insight: {
      en: "Compounding rewards time and consistency, but a volatile path can spend years below its previous peak. A good average return is not the same as a comfortable experience.",
      zh: "复利奖励时间与持续性，但高波动路径可能多年无法回到前期高点。平均收益不错，不等于投资体验舒适。"
    },
    formula: {
      en: "Ending wealth = starting wealth × (1 + return) per period, applied again and again.",
      zh: "期末财富 = 初始财富 ×（1 + 每期收益率），并在每一期继续滚动。"
    },
    chartLabel: { en: "FOUR SIMULATED PATHS · USD", zh: "四条模拟路径 · 美元" },
    chartUnit: { en: "USD", zh: "美元" },
    metrics: [
      { en: "MEDIAN ENDING VALUE", zh: "中位期末价值" },
      { en: "WORST DRAWDOWN", zh: "最大回撤" }
    ],
    controls: [
      { key: "annualReturn", label: { en: "Annual return", zh: "年化收益" }, min: 0, max: 15, step: 1, suffix: "%" },
      { key: "volatility", label: { en: "Annual volatility", zh: "年化波动率" }, min: 5, max: 40, step: 1, suffix: "%" },
      { key: "years", label: { en: "Time horizon", zh: "投资年限" }, min: 5, max: 30, step: 1, suffix: { en: " years", zh: " 年" } }
    ]
  },
  {
    id: "risk",
    step: "02",
    title: { en: "Same average, different journey.", zh: "同样的平均，不同的旅程。" },
    question: {
      en: "Move volatility and a market shock. How much can the path change even when the long-run return stays the same?",
      zh: "调整波动率和市场冲击。即使长期平均收益不变，路径可以发生多大变化？"
    },
    insight: {
      en: "Risk is not only the chance of losing money. It is the size and sequence of losses, the time needed to recover and the behavior those swings provoke.",
      zh: "风险不只是“会不会亏钱”，还包括亏损幅度、发生顺序、恢复时间，以及这些波动会诱发怎样的行为。"
    },
    formula: {
      en: "Maximum drawdown = (previous peak − later trough) ÷ previous peak.",
      zh: "最大回撤 =（前期高点 − 后续低点）÷ 前期高点。"
    },
    chartLabel: { en: "THREE VOLATILITY REGIMES · INDEXED", zh: "三种波动状态 · 指数化" },
    chartUnit: { en: "INDEX", zh: "指数" },
    metrics: [
      { en: "CURRENT MAX DRAWDOWN", zh: "当前最大回撤" },
      { en: "ONE-DAY SHOCK", zh: "单日冲击" }
    ],
    controls: [
      { key: "volatility", label: { en: "Daily volatility", zh: "日波动率" }, min: 0.5, max: 3, step: 0.1, suffix: "%", decimals: 1 },
      { key: "shock", label: { en: "Market shock", zh: "市场冲击" }, min: 1, max: 8, step: 0.5, suffix: "%", decimals: 1 }
    ]
  },
  {
    id: "diversify",
    step: "03",
    title: { en: "Combining bets changes risk.", zh: "组合会改变风险。" },
    question: {
      en: "Allocate between two assets and change their correlation. When does diversification help most?",
      zh: "在两个资产之间分配资金，并调整相关性。分散化在什么时候最有帮助？"
    },
    insight: {
      en: "Diversification works best when assets do not always fall together. Low correlation can reduce portfolio volatility without requiring either asset to become safer on its own.",
      zh: "当资产不总是同时下跌时，分散化最有效。低相关性可以降低组合波动，而不需要任何一个单项资产本身变得更安全。"
    },
    formula: {
      en: "Portfolio variance = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂.",
      zh: "组合方差 = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂。"
    },
    chartLabel: { en: "PORTFOLIO VOLATILITY BY ALLOCATION", zh: "不同配置下的组合波动率" },
    chartUnit: { en: "%", zh: "%" },
    metrics: [
      { en: "CURRENT PORTFOLIO VOLATILITY", zh: "当前组合波动率" },
      { en: "RISK REDUCTION", zh: "风险降低幅度" }
    ],
    controls: [
      { key: "weight", label: { en: "Risky asset weight", zh: "高波动资产权重" }, min: 0, max: 100, step: 5, suffix: "%" },
      { key: "correlation", label: { en: "Correlation", zh: "相关系数" }, min: -1, max: 1, step: 0.05, suffix: "", decimals: 2 },
      { key: "safeVolatility", label: { en: "Second asset volatility", zh: "第二资产波动率" }, min: 2, max: 20, step: 1, suffix: "%" }
    ]
  },
  {
    id: "signal",
    step: "04",
    title: { en: "Can you see the signal?", zh: "你能看见信号吗？" },
    question: {
      en: "Increase the true signal or the noise. What changes: the underlying relationship, or your ability to see it?",
      zh: "提高真实信号或噪声，变化的是底层关系本身，还是你看见它的能力？"
    },
    insight: {
      en: "A chart can look convincing even when most of its movement is noise. Quantitative research uses sample size, stability and statistical evidence to separate appearance from repeatability.",
      zh: "即使大部分变化来自噪声，图表也可能看起来很有说服力。量化研究用样本量、稳定性和统计证据区分“看起来像”和“可以重复”。"
    },
    formula: {
      en: "Signal-to-noise ratio = strength of the relationship ÷ variability that is not explained.",
      zh: "信噪比 = 关系强度 ÷ 未被关系解释的波动。"
    },
    chartLabel: { en: "OBSERVATIONS AROUND A HIDDEN RELATIONSHIP", zh: "围绕隐含关系的观测值" },
    chartUnit: { en: "VALUE", zh: "数值" },
    metrics: [
      { en: "OBSERVED CORRELATION", zh: "观测相关性" },
      { en: "SIGNAL-TO-NOISE", zh: "信噪比" }
    ],
    controls: [
      { key: "signal", label: { en: "True signal strength", zh: "真实信号强度" }, min: 0.1, max: 1, step: 0.05, suffix: "", decimals: 2 },
      { key: "noise", label: { en: "Noise level", zh: "噪声水平" }, min: 0.1, max: 1, step: 0.05, suffix: "", decimals: 2 },
      { key: "sampleSize", label: { en: "Sample size", zh: "样本数量" }, min: 20, max: 180, step: 10, suffix: { en: " observations", zh: " 个观测" } }
    ]
  },
  {
    id: "overfit",
    step: "05",
    title: { en: "Testing more can fool you.", zh: "试得越多，越容易被骗。" },
    question: {
      en: "Increase the number of random strategies you test. How quickly does the chance of finding a false winner rise?",
      zh: "增加随机策略的测试次数。找到一个“假赢家”的概率会多快上升？"
    },
    insight: {
      en: "Repeated testing creates false discoveries. A result that survives after many attempts needs stronger evidence, out-of-sample validation and an economic reason to believe it is real.",
      zh: "反复测试会制造伪发现。经历多次尝试后仍成立的结论，需要更强证据、样本外验证，以及相信它真实存在的经济理由。"
    },
    formula: {
      en: "P(at least one false winner) = 1 − (1 − α)ⁿ.",
      zh: "至少出现一个假赢家的概率 = 1 − (1 − α)ⁿ。"
    },
    chartLabel: { en: "CHANCE OF AT LEAST ONE FALSE DISCOVERY", zh: "至少出现一次伪发现的概率" },
    chartUnit: { en: "%", zh: "%" },
    metrics: [
      { en: "EXPECTED FALSE WINNERS", zh: "预期假赢家数量" },
      { en: "AT LEAST ONE", zh: "至少出现一次" }
    ],
    controls: [
      { key: "trials", label: { en: "Random strategies tested", zh: "随机策略测试次数" }, min: 1, max: 200, step: 1, suffix: "" },
      { key: "confidence", label: { en: "Confidence threshold", zh: "置信水平" }, min: 80, max: 99, step: 1, suffix: "%" }
    ]
  }
];

const labChallenges = {
  compound: {
    text: {
      en: "Try 5% annual return with 35% volatility for 20 years. Can a respectable average still feel like a bad journey?",
      zh: "试试 5% 年化收益、35% 波动率与 20 年期限。不错的平均值，是否仍可能带来难熬的旅程？"
    },
    preset: { annualReturn: 5, volatility: 35, years: 20 }
  },
  risk: {
    text: {
      en: "Set the shock to 7% and volatility to 2.5%. Compare the current path with the higher-volatility path.",
      zh: "把市场冲击设为 7%、波动率设为 2.5%，比较当前路径与高波动路径的差异。"
    },
    preset: { volatility: 2.5, shock: 7 }
  },
  diversify: {
    text: {
      en: "First set correlation to 0.9, then to −0.3. Keep the allocation unchanged and compare portfolio volatility.",
      zh: "先把相关系数设为 0.9，再设为 −0.3；保持配置不变，比较组合波动率。"
    },
    preset: { weight: 70, correlation: -0.3, safeVolatility: 8 }
  },
  signal: {
    text: {
      en: "Set signal strength to 0.3 and noise to 0.9. Ask whether you would still publish this pattern.",
      zh: "把信号强度设为 0.3、噪声设为 0.9，再判断你是否仍会发布这个规律。"
    },
    preset: { signal: 0.3, noise: 0.9, sampleSize: 40 }
  },
  overfit: {
    text: {
      en: "Test 120 random strategies at 99% confidence. How many false winners should you expect?",
      zh: "在 99% 置信水平下测试 120 个随机策略，你预期会出现多少假赢家？"
    },
    preset: { trials: 120, confidence: 99 }
  }
};

const labState = {
  compound: { annualReturn: 7, volatility: 18, years: 15 },
  risk: { volatility: 1.4, shock: 3.5 },
  diversify: { weight: 50, correlation: 0.25, safeVolatility: 10 },
  signal: { signal: 0.7, noise: 0.45, sampleSize: 85 },
  overfit: { trials: 50, confidence: 95 }
};

const investmentAssets = [
  { id: "stocks", label: { en: "Global equities", zh: "全球股票" }, color: "#4e9bff" },
  { id: "bonds", label: { en: "Bonds", zh: "债券" }, color: "#72e0ff" },
  { id: "gold", label: { en: "Gold", zh: "黄金" }, color: "#b9ddff" },
  { id: "cash", label: { en: "Cash", zh: "现金" }, color: "#7f93aa" }
];

const investmentScenarios = {
  neutral: {
    label: { en: "Neutral", zh: "中性情景" },
    description: {
      en: "Moderate growth, stable inflation and normal correlations.",
      zh: "温和增长、稳定通胀与常规相关性。"
    },
    returns: { stocks: 0.075, bonds: 0.04, gold: 0.05, cash: 0.022 },
    risks: { stocks: 0.17, bonds: 0.055, gold: 0.14, cash: 0.003 },
    factorLoadings: {
      stocks: [0.82, 0.18, 0],
      bonds: [0.22, 0.82, 0],
      gold: [-0.16, 0.08, 0.8],
      cash: [0, 0, 0]
    }
  },
  inflation: {
    label: { en: "Inflation shock", zh: "通胀冲击" },
    description: {
      en: "Sticky inflation, higher rates and a stronger role for real assets.",
      zh: "通胀黏性较强、利率上升，实物资产的重要性提高。"
    },
    returns: { stocks: 0.055, bonds: 0.015, gold: 0.075, cash: 0.025 },
    risks: { stocks: 0.21, bonds: 0.075, gold: 0.2, cash: 0.005 },
    factorLoadings: {
      stocks: [0.8, 0.3, 0.22],
      bonds: [-0.35, 0.86, 0.1],
      gold: [0.18, 0.35, 0.88],
      cash: [0, 0, 0]
    }
  },
  recession: {
    label: { en: "Recession", zh: "衰退情景" },
    description: {
      en: "Lower growth, wider credit risk and larger equity drawdowns.",
      zh: "增长放缓、信用风险扩大，股票回撤更深。"
    },
    returns: { stocks: 0.035, bonds: 0.04, gold: 0.055, cash: 0.018 },
    risks: { stocks: 0.24, bonds: 0.08, gold: 0.16, cash: 0.004 },
    factorLoadings: {
      stocks: [0.9, 0.12, 0.08],
      bonds: [0.18, 0.84, 0.04],
      gold: [0.24, 0.08, 0.82],
      cash: [0, 0, 0]
    }
  },
  boom: {
    label: { en: "Tech boom", zh: "科技繁荣" },
    description: {
      en: "Strong equity growth, higher concentration risk and more dispersion.",
      zh: "股票增长强劲，但集中度风险与结果分化更大。"
    },
    returns: { stocks: 0.115, bonds: 0.03, gold: 0.035, cash: 0.02 },
    risks: { stocks: 0.22, bonds: 0.06, gold: 0.13, cash: 0.003 },
    factorLoadings: {
      stocks: [0.93, 0.08, -0.06],
      bonds: [0.32, 0.78, 0],
      gold: [-0.08, 0.05, 0.84],
      cash: [0, 0, 0]
    }
  }
};

const investmentState = {
  amount: 100000,
  years: 15,
  fee: 0.5,
  rebalance: 3,
  scenario: "neutral",
  allocations: { stocks: 55, bonds: 30, gold: 10, cash: 5 }
};

const investmentProfiles = {
  defensive: { stocks: 20, bonds: 55, gold: 10, cash: 15 },
  balanced: { stocks: 55, bonds: 30, gold: 10, cash: 5 },
  growth: { stocks: 80, bonds: 14, gold: 3, cash: 3 }
};

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Language switching still works when storage is unavailable.
  }
}

function frenchTranslation(value) {
  return (
    window.HT_FR_TRANSLATIONS?.[value] ||
    window.HT_FR_TRANSLATIONS?.[String(value).trim()] ||
    value
  );
}

function japaneseTranslation(value) {
  return (
    window.HT_JA_TRANSLATIONS?.[value] ||
    window.HT_JA_TRANSLATIONS?.[String(value).trim()] ||
    value
  );
}

function uiText(english, chinese) {
  if (currentLanguage === "zh") return chinese;
  if (currentLanguage === "fr") return frenchTranslation(english);
  if (currentLanguage === "ja") return japaneseTranslation(english);
  return english;
}

function addFrenchTranslations(value, visited = new WeakSet()) {
  if (!value || typeof value !== "object") return;
  if (visited.has(value)) return;
  visited.add(value);

  if (Array.isArray(value)) {
    value.forEach((item) => addFrenchTranslations(item, visited));
    return;
  }

  if (typeof value.en === "string" && !value.fr) {
    value.fr = frenchTranslation(value.en);
  }

  if (Array.isArray(value.en) && !value.fr) {
    value.fr = value.en.map((item) => frenchTranslation(item));
  }

  if (typeof value.en === "string" && !value.ja) {
    value.ja = japaneseTranslation(value.en);
  }

  if (Array.isArray(value.en) && !value.ja) {
    value.ja = value.en.map((item) => japaneseTranslation(item));
  }

  Object.values(value).forEach((item) =>
    addFrenchTranslations(item, visited)
  );
}

function materializeLocalizedData() {
  [
    companyData,
    careerData,
    careerPlaybooks,
    questionBank,
    labDefinitions,
    labChallenges,
    labState,
    investmentAssets,
    investmentScenarios,
    investmentProfiles,
    researchTopics,
    researchTopicState,
    routeLabels
  ].forEach((item) => addFrenchTranslations(item));
}

function localizeTextElement(element, value) {
  if (!value) return;
  const localizedValue =
    currentLanguage === "fr"
      ? frenchTranslation(value)
      : currentLanguage === "ja"
        ? japaneseTranslation(value)
        : value;
  const isHeading =
    element.matches("h1, h2, h3, h4") ||
    Boolean(element.closest("h1, h2, h3, h4"));
  const finalValue = isHeading
    ? localizedValue.replace(/[.!?。！？]+$/g, "").trimEnd()
    : localizedValue;

  const directTextNodes = Array.from(element.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()
  );

  if (directTextNodes.length > 0) {
    directTextNodes[0].nodeValue = finalValue;
    directTextNodes.slice(1).forEach((node) => node.remove());
    return;
  }

  element.insertBefore(document.createTextNode(finalValue), element.firstChild);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyLanguage(language, persist = true) {
  const nextLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "ja";
  currentLanguage = nextLanguage;
  document.documentElement.lang = nextLanguage;

  document.querySelectorAll("[data-en]").forEach((element) => {
    const explicitValue = element.dataset[nextLanguage];
    const fallbackValue =
      nextLanguage === "fr"
        ? frenchTranslation(element.dataset.en)
        : nextLanguage === "ja"
          ? japaneseTranslation(element.dataset.en)
        : element.dataset.en;
    localizeTextElement(element, explicitValue || fallbackValue);
  });

  document.querySelectorAll("[data-en-placeholder]").forEach((element) => {
    const explicitValue = element.dataset[`${nextLanguage}Placeholder`];
    const fallbackValue =
      nextLanguage === "fr"
        ? frenchTranslation(element.dataset.enPlaceholder)
        : nextLanguage === "ja"
          ? japaneseTranslation(element.dataset.enPlaceholder)
        : element.dataset.enPlaceholder;
    element.placeholder = explicitValue || fallbackValue || "";
  });

  document.querySelectorAll("[data-en-aria-label]").forEach((element) => {
    const explicitValue = element.dataset[`${nextLanguage}AriaLabel`];
    const fallbackValue =
      nextLanguage === "fr"
        ? frenchTranslation(element.dataset.enAriaLabel)
        : nextLanguage === "ja"
          ? japaneseTranslation(element.dataset.enAriaLabel)
        : element.dataset.enAriaLabel;
    element.setAttribute("aria-label", explicitValue || fallbackValue || "");
  });

  document.querySelectorAll("[data-en-content]").forEach((element) => {
    const explicitValue = element.dataset[`${nextLanguage}Content`];
    const fallbackValue =
      nextLanguage === "fr"
        ? frenchTranslation(element.dataset.enContent)
        : nextLanguage === "ja"
          ? japaneseTranslation(element.dataset.enContent)
        : element.dataset.enContent;
    element.setAttribute("content", explicitValue || fallbackValue || "");
  });

  const body = document.body;
  document.title =
    nextLanguage === "zh"
      ? body.dataset.titleZh
      : nextLanguage === "fr"
        ? body.dataset.titleFr
        : nextLanguage === "ja"
          ? body.dataset.titleJa
        : body.dataset.titleEn;

  document.querySelectorAll(".language-toggle__option").forEach((option) => {
    const selected = option.dataset.language === nextLanguage;
    option.classList.toggle("is-active", selected);
    option.setAttribute("aria-pressed", String(selected));
  });

  const languageToggle = document.getElementById("languageToggle");
  if (languageToggle) {
    languageToggle.dataset.activeLanguage = nextLanguage;
  }

  renderCompanyGrid();
  renderCareerGrid();
  renderQuestion();
  renderQuantLab();
  renderInvestmentInterface();

  const bulletOutput = document.getElementById("bulletOutput");
  if (bulletOutput?.dataset.generated === "true") {
    generateResumeBullet(false);
  }

  if (currentCompany) {
    renderCompanyProfile(currentCompany);
  }

  if (currentCareer) {
    renderCareerProfile(currentCareer);
  }

  if (activeAppRoute) {
    document.title = routeTitle(activeAppRoute);
    const routeTitleElement = document.getElementById("pageRouteTitle");
    if (routeTitleElement) {
      routeTitleElement.textContent =
        researchTopics[activeAppRoute]?.title[nextLanguage] ||
        routeLabels[activeAppRoute][nextLanguage];
    }
  }

  if (activeResearchTopicId) {
    renderResearchTopic(activeResearchTopicId);
  }

  const footerLanguage = document.getElementById("footerLang");
  if (footerLanguage) {
    footerLanguage.textContent =
      nextLanguage === "en"
        ? "中文"
        : nextLanguage === "zh"
          ? "Français"
          : nextLanguage === "fr"
            ? "日本語"
            : "English";
  }

  if (persist) safeStorageSet(LANGUAGE_KEY, nextLanguage);
}

function renderCompanyGrid() {
  const grid = document.getElementById("companyGrid");
  if (!grid) return;

  const companies =
    companyRegionFilter === "all"
      ? companyData
      : companyData.filter((company) => company.region === companyRegionFilter);

  grid.innerHTML = companies
    .map((company) => {
      const index = companyData.findIndex((item) => item.id === company.id) + 1;
      const openLabel =
        currentLanguage === "zh"
          ? `打开 ${company.name} 详细档案`
          : currentLanguage === "fr"
            ? `Ouvrir la fiche de ${company.name}`
            : currentLanguage === "ja"
              ? `${company.name}の企業プロフィールを開く`
              : `Open the ${company.name} profile`;
      const regionLabel = uiText(
        company.region === "americas"
          ? "Americas"
          : company.region === "europe"
            ? "Europe"
            : "Asia",
        company.region === "americas"
          ? "美洲"
          : company.region === "europe"
            ? "欧洲"
            : "亚洲"
      );

      return `
        <button class="company-card" type="button" data-company-id="${company.id}" aria-label="${escapeHtml(openLabel)}">
          <span class="company-card__top">
            <span class="company-card__initials">${escapeHtml(company.initials)}</span>
            <span class="company-card__index">C / ${String(index).padStart(2, "0")}</span>
          </span>
          <span class="company-card__region">${escapeHtml(regionLabel).toUpperCase()}</span>
          <h3>${escapeHtml(company.name)}</h3>
          <span class="company-card__meta">
            <span>${escapeHtml(company.type[currentLanguage])}</span>
            <span>${escapeHtml(company.location[currentLanguage])}</span>
          </span>
          <span class="company-card__arrow" aria-hidden="true">↗</span>
        </button>
      `;
    })
    .join("");
}

function renderCompanyProfile(companyId) {
  const company = companyData.find((item) => item.id === companyId);
  const content = document.getElementById("companyDialogContent");
  if (!company || !content) return;

  currentCompany = company.id;
  const language = currentLanguage;
  const index = companyData.findIndex((item) => item.id === company.id) + 1;
  const kicker =
    language === "zh"
      ? `公司情报 / ${String(index).padStart(2, "0")}`
      : language === "fr"
        ? `INTELLIGENCE ENTREPRISE / ${String(index).padStart(2, "0")}`
        : language === "ja"
          ? `企業インテリジェンス / ${String(index).padStart(2, "0")}`
          : `COMPANY INTELLIGENCE / ${String(index).padStart(2, "0")}`;
  const detailsHeading = uiText("READ THE PROFILE", "阅读这篇公司档案");
  const careersLabel = uiText("Visit official careers ↗", "访问官方招聘页 ↗");
  const closeLabel = uiText("Return to company map", "返回公司地图");
  const sectorsLabel = uiText("BUSINESS FOOTPRINT", "业务版图");

  content.innerHTML = `
    <article class="company-profile">
      <header class="company-profile__hero">
        <p class="company-profile__kicker">${escapeHtml(kicker)}</p>
        <h2 id="companyDialogTitle">${escapeHtml(company.name)}</h2>
        <div class="company-profile__hero-meta">
          <span>${escapeHtml(company.type[language])}</span>
          <span>${escapeHtml(company.location[language])}</span>
        </div>
      </header>
      <div class="company-profile__body">
        <p>${escapeHtml(company.description[language])}</p>
        <div class="company-profile__sectors">
          <span>${escapeHtml(sectorsLabel)}</span>
          <div class="tag-row">
            ${company.sectors[language].map((sector) => `<span>${escapeHtml(sector)}</span>`).join("")}
          </div>
        </div>
        <div class="company-profile__details" aria-label="${escapeHtml(detailsHeading)}">
          <article>
            <span>01 / ${uiText("COMPANY LENS", "公司视角")}</span>
            <h3>${uiText("What it represents", "它代表的行业样本")}</h3>
            <p>${escapeHtml(company.lens[language])}</p>
          </article>
          <article>
            <span>02 / ${uiText("ROLE MAP", "岗位地图")}</span>
            <h3>${uiText("Which roles connect", "相互连接的典型职位")}</h3>
            <p>${escapeHtml(company.roles[language])}</p>
          </article>
          <article>
            <span>03 / ${uiText("HIRING CHAIN", "招聘链路")}</span>
            <h3>${uiText("The typical path", "典型招聘路径")}</h3>
            <p>${escapeHtml(company.process[language])}</p>
          </article>
          <article>
            <span>04 / ${uiText("PREPARATION EDGE", "准备重点")}</span>
            <h3>${uiText("How to prepare", "建立竞争力的方向")}</h3>
            <p>${escapeHtml(company.prepare[language])}</p>
          </article>
        </div>
        <div class="company-profile__actions">
          <a href="${escapeHtml(company.careers)}" target="_blank" rel="noopener noreferrer">${escapeHtml(careersLabel)}</a>
          <button class="text-link" type="button" data-close-dialog>${escapeHtml(closeLabel)} <span aria-hidden="true">×</span></button>
        </div>
        <p class="company-profile__note">${escapeHtml(company.watch[language])}</p>
      </div>
    </article>
  `;
}

function renderCareerGrid() {
  const grid = document.getElementById("careerGrid");
  if (!grid) return;

  grid.innerHTML = careerData
    .map((role, index) => {
      const openLabel =
        currentLanguage === "zh"
          ? `查看 ${role.title[currentLanguage]} 详细介绍`
          : currentLanguage === "fr"
            ? `Voir les détails du poste ${role.title[currentLanguage]}`
            : currentLanguage === "ja"
              ? `${role.title[currentLanguage]}の仕事内容とワークチェーンを見る`
              : `View ${role.title[currentLanguage]} role details`;
      const actionLabel = uiText("View role details", "查看岗位详情");

      return `
        <button class="career-card" type="button" data-career-id="${role.id}" aria-label="${escapeHtml(openLabel)}">
          <span class="career-card__top">${String(index + 1).padStart(2, "0")} / ${escapeHtml(role.division[currentLanguage]).toUpperCase()}</span>
          <h4>${escapeHtml(role.title[currentLanguage])}</h4>
          <p>${escapeHtml(role.summary[currentLanguage])}</p>
          <small>${escapeHtml(role.skills[currentLanguage])}</small>
          <em>${escapeHtml(role.firms[currentLanguage])}</em>
          <span class="career-card__action">${escapeHtml(actionLabel)} <i aria-hidden="true">↗</i></span>
        </button>
      `;
    })
    .join("");
}

function renderCareerProfile(roleId) {
  const role = careerData.find((item) => item.id === roleId);
  const playbook = careerPlaybooks[roleId];
  const content = document.getElementById("careerDialogContent");
  if (!role || !playbook || !content) return;

  currentCareer = role.id;
  const language = currentLanguage;
  const kicker = uiText("ROLE PLAYBOOK / WORK CHAIN", "岗位工作链 / ROLE PLAYBOOK");
  const workLabel = uiText("WHAT YOU WILL DO", "你会做什么");
  const chainLabel = uiText("HOW THE WORK MOVES", "工作如何流转");
  const prepLabel = uiText("WHAT TO PREPARE", "面试前要准备什么");
  const questionLabel = uiText("INTERVIEW QUESTIONS TO PRACTICE", "可直接练习的面试题");
  const drillLabel = uiText("Open the interview lab", "进入笔面试训练");

  content.innerHTML = `
    <article class="career-profile">
      <header class="career-profile__hero">
        <p class="career-profile__kicker">${escapeHtml(kicker)}</p>
        <span class="career-profile__division">${escapeHtml(role.division[language])}</span>
        <h2 id="careerDialogTitle">${escapeHtml(role.title[language])}</h2>
        <p>${escapeHtml(playbook.overview[language])}</p>
        <div class="tag-row tag-row--light">
          <span>${escapeHtml(role.firms[language])}</span>
        </div>
      </header>
      <div class="career-profile__body">
        <div class="career-profile__work">
          <section>
            <span>01 / ${escapeHtml(workLabel)}</span>
            <h3>${uiText("Day-to-day work", "日常工作内容")}</h3>
            <ul>
              ${playbook.work[language].map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </section>
          <section>
            <span>02 / ${escapeHtml(chainLabel)}</span>
            <h3>${uiText("The work chain", "完整工作链")}</h3>
            <ol class="role-chain">
              ${playbook.chain[language].map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ol>
          </section>
        </div>
        <div class="career-profile__prep">
          <p><span>03 / ${escapeHtml(prepLabel)}</span></p>
          <ul>
            ${playbook.prepare[language].map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
        <div class="career-profile__questions">
          <span>04 / ${escapeHtml(questionLabel)}</span>
          ${playbook.questions[language].map((question) => `<blockquote>${escapeHtml(question)}</blockquote>`).join("")}
        </div>
        <div class="career-profile__actions">
          <a class="text-link" href="#/interview-lab" data-page-route="interview" data-close-dialog>${escapeHtml(drillLabel)} <span aria-hidden="true">↗</span></a>
          <button class="text-link" type="button" data-close-dialog>${uiText("Return to role library", "返回岗位库")} <span aria-hidden="true">×</span></button>
        </div>
      </div>
    </article>
  `;
}

function openCompanyDialog(companyId) {
  renderCompanyProfile(companyId);
  const dialog = document.getElementById("companyDialog");
  if (dialog && !dialog.open) {
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }
}

function openCareerDialog(roleId) {
  renderCareerProfile(roleId);
  const dialog = document.getElementById("careerDialog");
  if (dialog && !dialog.open) {
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }
}

function setupLanguage() {
  const saved = safeStorageGet(LANGUAGE_KEY);
  applyLanguage(saved || "ja", false);

  document.querySelectorAll(".language-toggle__option").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.language);
    });
  });

  const footerLanguage = document.getElementById("footerLang");
  const updateFooterLanguage = () => {
    if (!footerLanguage) return;
    footerLanguage.textContent =
      currentLanguage === "en"
        ? "中文"
        : currentLanguage === "zh"
          ? "Français"
          : currentLanguage === "fr"
            ? "日本語"
            : "English";
  };
  updateFooterLanguage();

  footerLanguage?.addEventListener("click", () => {
    const nextLanguage =
      currentLanguage === "en"
        ? "zh"
        : currentLanguage === "zh"
          ? "fr"
          : currentLanguage === "fr"
            ? "ja"
            : "en";
    applyLanguage(nextLanguage);
    updateFooterLanguage();
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  });
}

function setupNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("navLinks");

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    document.body.classList.toggle("menu-open", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });

  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress span");
  let scrollTicking = false;

  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle("is-scrolled", scrollTop > 18);

    if (progress) {
      progress.style.transform = `scaleX(${scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0})`;
    }

    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateScrollState);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateScrollState();
}

const researchTopics = {
  liquidity: {
    category: { en: "MARKET STRUCTURE / 01", zh: "市场结构 / 01" },
    title: { en: "Where liquidity disappears", zh: "流动性在哪里消失" },
    lede: {
      en: "Liquidity is not a permanent pool. It is a set of conditional commitments that can thin out exactly when investors need them most.",
      zh: "流动性不是一个永久水池，而是一组有条件的承诺；它可能在投资者最需要的时候迅速变薄。"
    },
    why: {
      en: "Spreads and quoted depth affect execution cost, price discovery and the speed at which risk can be transferred. Stress can turn a liquid asset into a costly one without changing its legal identity.",
      zh: "价差和报价深度影响执行成本、价格发现与风险转移速度。压力来临时，一项资产的法定属性没变，交易成本却可能急剧上升。"
    },
    question: {
      en: "How do depth, spreads and price impact change around scheduled information releases and unexpected market shocks?",
      zh: "在预定信息发布与突发市场冲击前后，深度、价差和价格冲击如何变化？"
    },
    concepts: {
      en: ["Limit order book", "Quoted and executable depth", "Bid-ask spread", "Price impact"],
      zh: ["限价订单簿", "报价深度与可成交深度", "买卖价差", "价格冲击"]
    },
    methods: {
      en: ["Define the event window and benchmark", "Reconstruct best bid and offer", "Measure depth and spread changes", "Estimate price impact by order size", "Compare with control periods"],
      zh: ["定义事件窗口与基准", "重构最优买卖报价", "测量深度与价差变化", "估算不同订单规模的价格冲击", "与对照时段比较"]
    },
    outputs: {
      en: ["Event-window dataset", "Liquidity stress chart", "Execution-cost estimate", "One-page research brief"],
      zh: ["事件窗口数据集", "流动性压力图", "执行成本估计", "一页研究简报"]
    },
    chartLabel: { en: "ESTIMATED PRICE IMPACT BY ORDER SIZE", zh: "不同订单规模的估计价格冲击" },
    metricLabels: [
      { en: "CURRENT SPREAD", zh: "当前价差" },
      { en: "IMPACT AT SIZE", zh: "当前规模冲击" }
    ],
    controls: [
      { key: "stress", label: { en: "Market stress", zh: "市场压力" }, min: 0, max: 100, step: 5, suffix: "%" },
      { key: "orderSize", label: { en: "Order size", zh: "订单规模" }, min: 1, max: 100, step: 1, suffix: "% ADV" }
    ]
  },
  "factor-decay": {
    category: { en: "SYSTEMATIC ALPHA / 02", zh: "系统化阿尔法 / 02" },
    title: { en: "Why factors decay", zh: "因子为什么会衰减" },
    lede: {
      en: "A signal is a temporary claim on market behavior. As more capital recognizes it, the edge can compress through crowding, competition and changing costs.",
      zh: "信号只是对市场行为的一项暂时主张。随着更多资本识别它，优势可能因拥挤、竞争与成本变化而被压缩。"
    },
    why: {
      en: "Factor decay changes capacity, turnover and the value of research. A backtest can be historically accurate yet commercially irrelevant if the edge disappears before implementation.",
      zh: "因子衰减会改变容量、换手与研究价值。一个回测即使历史准确，如果优势在上线前就消失，也可能没有商业意义。"
    },
    question: {
      en: "How quickly does a signal lose explanatory power after publication, crowding or a change in transaction costs?",
      zh: "在信号公开、策略拥挤或交易成本变化后，它的解释力会以多快速度下降？"
    },
    concepts: {
      en: ["Gross alpha", "Half-life", "Capacity", "Crowding"],
      zh: ["毛阿尔法", "半衰期", "容量", "策略拥挤"]
    },
    methods: {
      en: ["Construct a point-in-time factor", "Define the target and holding period", "Estimate decay across horizons", "Adjust for turnover and costs", "Test decay out of sample"],
      zh: ["构建时点化因子", "定义预测目标与持有期", "估计不同期限的衰减", "调整换手与交易成本", "在样本外检验衰减"]
    },
    outputs: {
      en: ["Factor definition", "Decay curve", "Capacity estimate", "Implementation memo"],
      zh: ["因子定义", "衰减曲线", "容量估计", "实施备忘录"]
    },
    chartLabel: { en: "SIGNAL REMAINING AFTER PUBLICATION", zh: "公开之后仍然存在的信号" },
    metricLabels: [
      { en: "HALF-LIFE", zh: "半衰期" },
      { en: "24-MONTH REMNANT", zh: "24 个月残余" }
    ],
    controls: [
      { key: "halfLife", label: { en: "Signal half-life", zh: "信号半衰期" }, min: 2, max: 36, step: 1, suffix: { en: " months", zh: " 个月" } },
      { key: "initialAlpha", label: { en: "Gross signal", zh: "毛信号强度" }, min: 1, max: 20, step: 1, suffix: { en: " bps", zh: " 基点" } }
    ]
  },
  "model-governance": {
    category: { en: "MODEL GOVERNANCE / 03", zh: "模型治理 / 03" },
    title: { en: "When a model should stop trading", zh: "模型何时应该停止交易" },
    lede: {
      en: "Model governance is a decision system for distinguishing acceptable variation from structural failure before losses become irreversible.",
      zh: "模型治理是一套决策系统，在损失变得不可逆之前区分可接受的正常波动与结构性失效。"
    },
    why: {
      en: "Every monitoring rule involves a trade-off. Sensitive thresholds catch failure early but generate noise; permissive thresholds reduce false alarms but may allow larger losses.",
      zh: "每条监控规则都包含权衡。敏感阈值能更早发现失效，却会制造噪声；宽松阈值减少误报，却可能放任更大损失。"
    },
    question: {
      en: "Which combination of drift metrics, alert thresholds and human review can detect failure without overwhelming the control team?",
      zh: "漂移指标、预警阈值与人工复核如何组合，才能在发现失效的同时避免控制团队被警报淹没？"
    },
    concepts: {
      en: ["Model drift", "False positive", "Missed detection", "Kill switch"],
      zh: ["模型漂移", "误报", "漏检", "熔断开关"]
    },
    methods: {
      en: ["Specify the model's intended regime", "Select leading drift metrics", "Set alert and review thresholds", "Backtest alert behavior", "Define escalation and shutdown rules"],
      zh: ["明确模型的适用状态", "选择领先漂移指标", "设定预警与复核阈值", "回测警报行为", "定义升级与停用规则"]
    },
    outputs: {
      en: ["Model risk register", "Alert calibration chart", "Escalation protocol", "Monitoring note"],
      zh: ["模型风险台账", "预警校准图", "升级协议", "监控说明"]
    },
    chartLabel: { en: "FALSE ALERTS VERSUS DETECTION THRESHOLD", zh: "误报与检测阈值" },
    metricLabels: [
      { en: "EXPECTED ALERTS / YEAR", zh: "预计年警报数" },
      { en: "REVIEW LOAD / MONTH", zh: "每月复核量" }
    ],
    controls: [
      { key: "threshold", label: { en: "Alert threshold", zh: "预警阈值" }, min: 1, max: 5, step: 0.1, suffix: "σ", decimals: 1 },
      { key: "checkDays", label: { en: "Monitoring interval", zh: "监控间隔" }, min: 1, max: 20, step: 1, suffix: { en: " days", zh: " 天" } }
    ]
  },
  "law-and-markets": {
    category: { en: "LAW & MARKETS / 04", zh: "法律与市场 / 04" },
    title: { en: "How regulation changes value", zh: "监管如何改变价值" },
    lede: {
      en: "Regulation affects markets through constraints, incentives and information. Its economic effect appears in cash flows, liquidity and the distribution of risk.",
      zh: "监管通过约束、激励与信息影响市场，其经济效果最终体现在现金流、流动性与风险分布上。"
    },
    why: {
      en: "A rule can change who bears a loss, how quickly capital can move and what counts as compliant behavior. These effects are often missing from purely statistical models.",
      zh: "规则会改变谁承担损失、资本能够多快流动，以及什么行为算合规。这些影响常常缺席于纯统计模型。"
    },
    question: {
      en: "How can a legal rule be translated into observable changes in pricing, capital allocation and market conduct?",
      zh: "如何把一条法律规则转化为价格、资本配置与市场行为中的可观察变化？"
    },
    concepts: {
      en: ["Rule design", "Enforcement probability", "Compliance cost", "Market adaptation"],
      zh: ["规则设计", "执法概率", "合规成本", "市场适应"]
    },
    methods: {
      en: ["Map the legal text and intended objective", "Identify affected actors and constraints", "Define a measurable economic channel", "Compare before and after the rule", "Separate compliance from confounding effects"],
      zh: ["梳理法律文本与政策目标", "识别受影响主体与约束", "定义可衡量的经济传导渠道", "比较规则前后变化", "区分合规效应与其他干扰"]
    },
    outputs: {
      en: ["Rule-to-market map", "Legal risk matrix", "Scenario analysis", "Policy research brief"],
      zh: ["规则到市场传导图", "法律风险矩阵", "情景分析", "政策研究简报"]
    },
    chartLabel: { en: "ILLUSTRATIVE COMPLIANCE BURDEN", zh: "示意性合规负担" },
    metricLabels: [
      { en: "BURDEN INDEX", zh: "负担指数" },
      { en: "ADAPTATION GAP", zh: "适应缺口" }
    ],
    controls: [
      { key: "stringency", label: { en: "Rule stringency", zh: "规则严格度" }, min: 0, max: 100, step: 5, suffix: "%" },
      { key: "enforcement", label: { en: "Enforcement probability", zh: "执法概率" }, min: 0, max: 100, step: 5, suffix: "%" }
    ]
  },
  "global-contagion": {
    category: { en: "GLOBAL MARKETS / 05", zh: "全球市场 / 05" },
    title: { en: "Which shocks cross borders", zh: "哪些冲击会跨境传导" },
    lede: {
      en: "Global shocks travel through funding, trade, currency and sentiment channels. Geography matters, but so do time zones, market structure and policy response.",
      zh: "全球冲击通过融资、贸易、汇率与情绪渠道传导。地理位置重要，时区、市场结构与政策反应同样重要。"
    },
    why: {
      en: "A shock that begins in one market can change collateral values and risk limits elsewhere. Cross-market research tests whether apparent contagion is causal or simply common exposure.",
      zh: "一个市场中的冲击可能改变其他市场的抵押品价值与风险限额。跨市场研究要检验表面传染究竟是因果关系，还是共同风险敞口。"
    },
    question: {
      en: "How quickly and through which channels does a rate, credit or technology shock propagate across the US, Europe and Asia?",
      zh: "利率、信用或科技冲击会以多快速度、通过哪些渠道在美国、欧洲与亚洲之间传导？"
    },
    concepts: {
      en: ["Contagion", "Common exposure", "Funding channel", "Time-zone effects"],
      zh: ["传染效应", "共同敞口", "融资渠道", "时区效应"]
    },
    methods: {
      en: ["Align event timestamps across markets", "Identify the source and transmission channels", "Measure impact by region and asset", "Compare correlations before and after", "Control for shared macro factors"],
      zh: ["跨市场对齐事件时间", "识别来源与传导渠道", "分区域和资产测量影响", "比较事件前后相关性", "控制共同宏观因素"]
    },
    outputs: {
      en: ["Cross-market event map", "Transmission chart", "Exposure matrix", "Global risk note"],
      zh: ["跨市场事件地图", "传导图", "风险敞口矩阵", "全球风险简报"]
    },
    chartLabel: { en: "ILLUSTRATIVE CROSS-MARKET TRANSMISSION", zh: "示意性跨市场传导" },
    metricLabels: [
      { en: "EUROPE PEAK IMPACT", zh: "欧洲峰值影响" },
      { en: "ASIA PEAK IMPACT", zh: "亚洲峰值影响" }
    ],
    controls: [
      { key: "shockSize", label: { en: "Initial shock", zh: "初始冲击" }, min: 1, max: 10, step: 0.5, suffix: "%", decimals: 1 },
      { key: "contagion", label: { en: "Contagion strength", zh: "传染强度" }, min: 0, max: 100, step: 5, suffix: "%" }
    ]
  },
  "competition-signals": {
    category: { en: "COMPETITION & TALENT / 06", zh: "赛事与人才 / 06" },
    title: { en: "What signals predict performance", zh: "什么信号能够预测表现" },
    lede: {
      en: "Competitions produce observable evidence of reasoning, communication and judgment. The research task is to identify which signals remain informative after accounting for preparation and selection.",
      zh: "赛事产生关于推理、沟通与判断力的可观察证据。研究任务是识别哪些信号在控制准备程度与样本选择后仍具有信息量。"
    },
    why: {
      en: "Students and employers both use competition outcomes as signals, but a polished presentation can mask weak analysis. Better signal design improves learning and hiring decisions.",
      zh: "学生与雇主都会把赛事结果视为信号，但精致的展示可能掩盖薄弱分析。更好的信号设计能够改善学习与招聘判断。"
    },
    question: {
      en: "Which competition formats and scoring rubrics reveal repeatable analytical capability rather than preparation alone?",
      zh: "哪些赛制与评分规则能揭示可重复的分析能力，而不是仅仅衡量准备充分程度？"
    },
    concepts: {
      en: ["Signal validity", "Selection bias", "Rubric design", "Team contribution"],
      zh: ["信号有效性", "选择偏差", "评分规则设计", "团队贡献"]
    },
    methods: {
      en: ["Define the capability being measured", "Code competition format and rubric", "Collect outcomes over multiple rounds", "Control for preparation and selection", "Test whether signals repeat"],
      zh: ["定义希望衡量的能力", "编码赛制与评分规则", "收集多轮比赛结果", "控制准备程度与样本选择", "检验信号能否重复"]
    },
    outputs: {
      en: ["Competition taxonomy", "Rubric analysis", "Signal reliability note", "Talent evidence map"],
      zh: ["赛事分类体系", "评分规则分析", "信号可靠性说明", "人才证据地图"]
    },
    chartLabel: { en: "ILLUSTRATIVE TEAM SIGNAL PROFILE", zh: "示意性团队信号画像" },
    metricLabels: [
      { en: "WEIGHTED SIGNAL", zh: "加权信号" },
      { en: "WEAKEST DIMENSION", zh: "最弱维度" }
    ],
    controls: [
      { key: "analysis", label: { en: "Analytical rigor", zh: "分析严谨" }, min: 0, max: 100, step: 5, suffix: "%" },
      { key: "communication", label: { en: "Communication", zh: "沟通表达" }, min: 0, max: 100, step: 5, suffix: "%" },
      { key: "judgment", label: { en: "Judgment", zh: "判断力" }, min: 0, max: 100, step: 5, suffix: "%" }
    ]
  }
};

const researchTopicState = {
  liquidity: { stress: 45, orderSize: 60 },
  "factor-decay": { halfLife: 14, initialAlpha: 10 },
  "model-governance": { threshold: 3, checkDays: 5 },
  "law-and-markets": { stringency: 60, enforcement: 65 },
  "global-contagion": { shockSize: 5, contagion: 55 },
  "competition-signals": { analysis: 75, communication: 65, judgment: 70 }
};

const routeLabels = {
  research: { en: "Research", zh: "研究" },
  labs: { en: "Labs", zh: "实验室" },
  quant: { en: "Concept Lab", zh: "量化概念实验室" },
  investment: { en: "Investment Simulator", zh: "投资模拟实验室" },
  competitions: { en: "Competitions", zh: "赛事" },
  companies: { en: "Companies", zh: "公司" },
  careers: { en: "Careers", zh: "职业" },
  interview: { en: "Interview Lab", zh: "笔面试实验室" },
  council: { en: "Council", zh: "委员会" }
};

function routeTitle(route) {
  if (route && researchTopics[route]) {
    return `${researchTopics[route].title[currentLanguage]} | High Table`;
  }
  if (route && routeLabels[route]) {
    return `${routeLabels[route][currentLanguage]} | High Table`;
  }
  return currentLanguage === "zh"
    ? document.body.dataset.titleZh
    : currentLanguage === "fr"
      ? document.body.dataset.titleFr
      : currentLanguage === "ja"
        ? document.body.dataset.titleJa
      : document.body.dataset.titleEn;
}

function activateAppRoute(route, updateHistory = true) {
  const validRoute =
    route && (appRoutes[route] || researchTopics[route]) ? route : null;
  const apply = () => {
    activeAppRoute = validRoute;
    const isResearchTopic = Boolean(
      validRoute && researchTopics[validRoute]
    );
    activeResearchTopicId = isResearchTopic ? validRoute : null;
    document.body.classList.toggle("module-route", Boolean(validRoute));
    document.body.classList.toggle(
      "lab-route",
      validRoute === "quant" || validRoute === "investment"
    );
    if (validRoute) {
      document.body.dataset.route = isResearchTopic
        ? "research-topic"
        : validRoute;
      if (isResearchTopic) {
        document.body.dataset.topic = validRoute;
      } else {
        delete document.body.dataset.topic;
      }
    } else {
      delete document.body.dataset.route;
      delete document.body.dataset.topic;
    }
    document.title = routeTitle(validRoute);

    const routeTitleElement = document.getElementById("pageRouteTitle");
    if (routeTitleElement) {
      routeTitleElement.textContent = validRoute
        ? researchTopics[validRoute]
          ? researchTopics[validRoute].title[currentLanguage]
          : routeLabels[validRoute][currentLanguage]
        : "";
    }

    document.querySelectorAll(".nav__links a").forEach((link) => {
      const navRoute = isResearchTopic ? "research" : validRoute;
      if (link.dataset.pageRoute === navRoute) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const quickLink = document.getElementById("pageRouteQuickLink");
    if (quickLink) {
      if (validRoute === "labs" || validRoute === "quant" || validRoute === "investment") {
        quickLink.hidden = false;
        quickLink.href = appRoutes.labs;
        quickLink.dataset.pageRoute = "labs";
        quickLink.dataset.en = "All labs";
        quickLink.dataset.zh = "全部实验室";
        quickLink.textContent = uiText("All labs", "全部实验室");
      } else if (isResearchTopic) {
        quickLink.hidden = false;
        quickLink.href = appRoutes.research;
        quickLink.dataset.pageRoute = "research";
        quickLink.dataset.en = "All research";
        quickLink.dataset.zh = "全部研究议题";
        quickLink.textContent = uiText("All research", "全部研究议题");
      } else {
        quickLink.hidden = true;
      }
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      if (validRoute === "quant") renderQuantLab();
      if (validRoute === "investment") {
        renderInvestmentInterface();
        runInvestmentSimulation();
      }
      if (isResearchTopic) {
        renderResearchTopic(validRoute);
      }
    });
  };

  if (document.startViewTransition && updateHistory) {
    document.startViewTransition(apply);
  } else {
    document.body.classList.add("route-transitioning");
    apply();
    window.setTimeout(() => {
      document.body.classList.remove("route-transitioning");
    }, 420);
  }

  if (updateHistory) {
    history.pushState(
      { route: validRoute },
      "",
      validRoute
        ? appRoutes[validRoute] || researchTopicRoutes[validRoute]
        : "#/"
    );
  }
}

function syncRouteFromLocation() {
  const hash = window.location.hash;
  const route =
    Object.entries(appRoutes).find(([, routeHash]) => routeHash === hash)?.[0] ||
    Object.entries(researchTopicRoutes).find(([, routeHash]) => routeHash === hash)?.[0] ||
    null;
  if (route !== activeAppRoute) activateAppRoute(route, false);
}

function setupLabRoutes() {
  document.querySelectorAll("[data-lab-route], [data-page-route], [data-research-topic]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      activateAppRoute(
        link.dataset.labRoute ||
          link.dataset.pageRoute ||
          link.dataset.researchTopic,
        true
      );
    });
  });

  document.querySelectorAll("[data-route-close]").forEach((button) => {
    button.addEventListener("click", () => {
      activateAppRoute(null, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.addEventListener("click", (event) => {
    if (!activeAppRoute) return;
    const anchor = event.target.closest('a[href^="#"]');
    if (
      !anchor ||
      anchor.dataset.labRoute ||
      anchor.dataset.pageRoute ||
      anchor.dataset.researchTopic ||
      anchor.getAttribute("href").startsWith("#/")
    ) {
      return;
    }

    const targetSelector = anchor.getAttribute("href");
    event.preventDefault();
    activateAppRoute(null, true);
    window.setTimeout(() => {
      document.querySelector(targetSelector)?.scrollIntoView({
        block: "start",
        behavior: "smooth"
      });
    }, 80);
  });

  window.addEventListener("popstate", syncRouteFromLocation);
  window.addEventListener("hashchange", syncRouteFromLocation);
  syncRouteFromLocation();
}

function setupTabs(tabSelector, panelSelector, activeClass = "is-active") {
  const tabs = Array.from(document.querySelectorAll(tabSelector));
  const panels = Array.from(document.querySelectorAll(panelSelector));

  const activateTab = (tab) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle(activeClass, selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel.id === tab.getAttribute("aria-controls");
      panel.hidden = !selected;
      panel.classList.toggle(activeClass, selected);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });
}

function setupCompetitionFilters() {
  const filters = Array.from(document.querySelectorAll("[data-competition-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-competition-category]"));

  filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const category = filterButton.dataset.competitionFilter;

      filters.forEach((button) => {
        const selected = button === filterButton;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      cards.forEach((card) => {
        const categories = card.dataset.competitionCategory.split(" ");
        card.hidden = category !== "all" && !categories.includes(category);
      });
    });
  });
}

function setupCompanyFilters() {
  const filters = Array.from(document.querySelectorAll("[data-company-region]"));

  filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      companyRegionFilter = filterButton.dataset.companyRegion;

      filters.forEach((button) => {
        const selected = button === filterButton;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      renderCompanyGrid();
    });
  });
}

function updateResumeProgress() {
  const checks = Array.from(document.querySelectorAll("[data-resume-check]"));
  const completed = checks.filter((checkbox) => checkbox.checked).length;
  const text = document.getElementById("resumeProgressText");
  const bar = document.getElementById("resumeProgressBar");

  if (text) text.textContent = `${completed} / ${checks.length}`;
  if (bar) bar.style.width = `${checks.length ? (completed / checks.length) * 100 : 0}%`;
}

function generateResumeBullet(persist = true) {
  const form = document.getElementById("bulletBuilder");
  const output = document.getElementById("bulletOutput");
  if (!form || !output) return;

  const data = new FormData(form);
  const action = String(data.get("action") || "").trim();
  const task = String(data.get("task") || "").trim();
  const method = String(data.get("method") || "").trim();
  const result = String(data.get("result") || "").trim();

  if (!action || !task || !method || !result) {
    output.textContent =
      uiText(
        "Complete all four fields to generate a bullet.",
        "请填写全部四栏后再生成。"
      );
    delete output.dataset.generated;
    return;
  }

  const sentence =
    currentLanguage === "zh"
      ? `${action}${task}，${method}，最终${result}。`
      : currentLanguage === "fr"
        ? `${action} ${task} ${method}, avec pour résultat ${result}.`
        : currentLanguage === "ja"
          ? `${action}${task}。${method}、${result}。`
          : `${action.charAt(0).toUpperCase()}${action.slice(1)} ${task} ${method}, ${result}.`;

  output.textContent = sentence;
  if (persist) output.dataset.generated = "true";
}

function setupResumeLab() {
  document.querySelectorAll("[data-resume-check]").forEach((checkbox) => {
    checkbox.addEventListener("change", updateResumeProgress);
  });
  updateResumeProgress();

  document.getElementById("bulletBuilder")?.addEventListener("submit", (event) => {
    event.preventDefault();
    generateResumeBullet(true);
  });
}

function renderQuestion() {
  const category = questionBank[activeQuestionCategory] || questionBank.ibd;
  const question = category[activeQuestionIndex % category.length];
  const questionText = document.getElementById("drillQuestion");
  const framework = document.getElementById("drillFramework");
  const counter = document.getElementById("questionCounter");
  const categoryLabel = document.getElementById("questionCategoryLabel");
  const answer = document.getElementById("drillAnswer");
  if (!questionText || !framework) return;

  document.querySelectorAll("[data-question-category]").forEach((button) => {
    const selected = button.dataset.questionCategory === activeQuestionCategory;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  const activeButton = document.querySelector(
    `[data-question-category="${activeQuestionCategory}"]`
  );
  questionText.textContent = question.question[currentLanguage];
  framework.textContent = question.framework[currentLanguage];
  counter.textContent = `QUESTION ${String(activeQuestionIndex + 1).padStart(2, "0")} / ${String(category.length).padStart(2, "0")}`;
  categoryLabel.textContent = activeButton
    ? activeButton.dataset[currentLanguage] || activeButton.textContent.trim()
    : activeQuestionCategory.toUpperCase();
  if (answer) answer.hidden = true;
}

function setupQuestionDrill() {
  document.querySelectorAll("[data-question-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeQuestionCategory = button.dataset.questionCategory;
      activeQuestionIndex = 0;
      renderQuestion();
    });
  });

  document.getElementById("revealAnswer")?.addEventListener("click", () => {
    const answer = document.getElementById("drillAnswer");
    if (answer) answer.hidden = false;
  });

  document.getElementById("nextQuestion")?.addEventListener("click", () => {
    const category = questionBank[activeQuestionCategory];
    activeQuestionIndex = (activeQuestionIndex + 1) % category.length;
    renderQuestion();
  });

  renderQuestion();
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomNormal(random) {
  const first = Math.max(random(), 1e-9);
  const second = random();
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

function formatLabControlValue(control, value) {
  const suffix =
    typeof control.suffix === "object"
      ? control.suffix[currentLanguage]
      : control.suffix || "";
  return `${Number(value).toFixed(control.decimals || 0)}${suffix}`;
}

function lineChartMarkup({
  series,
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  chartId = "labChart",
  xFormat = (value) => String(Math.round(value)),
  yFormat = (value) => String(Math.round(value)),
  marker = null
}) {
  const svg = document.getElementById(chartId);
  const width = Math.max(280, Math.round(svg?.viewBox.baseVal.width || 760));
  const height = Math.max(280, Math.round(svg?.viewBox.baseVal.height || 430));
  const compact = width < 520;
  const pad = {
    left: compact ? 54 : 76,
    right: compact ? 16 : 26,
    top: compact ? 22 : 28,
    bottom: compact ? 52 : 60
  };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const xScale = (value) =>
    pad.left +
    ((value - xDomain[0]) / Math.max(xDomain[1] - xDomain[0], 1)) * innerWidth;
  const yScale = (value) =>
    pad.top +
    (1 - (value - yDomain[0]) / Math.max(yDomain[1] - yDomain[0], 1)) *
      innerHeight;
  const yTickCount = compact ? 4 : 5;
  const xTickCount = compact ? 4 : 6;
  const yTicks = Array.from({ length: yTickCount }, (_, index) =>
    yDomain[0] + ((yDomain[1] - yDomain[0]) * index) / (yTickCount - 1)
  );
  const xTicks = Array.from({ length: xTickCount }, (_, index) =>
    xDomain[0] + ((xDomain[1] - xDomain[0]) * index) / (xTickCount - 1)
  );
  const grid = [
    ...yTicks.map(
      (value) =>
        `<line class="lab-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${yScale(value)}" y2="${yScale(value)}"/>`
    ),
    ...xTicks.map(
      (value) =>
        `<line class="lab-grid-line lab-grid-line--vertical" x1="${xScale(value)}" x2="${xScale(value)}" y1="${pad.top}" y2="${height - pad.bottom}"/>`
    )
  ].join("");
  const yLabels = yTicks
    .map(
      (value) =>
        `<text class="lab-axis-text" x="${pad.left - 12}" y="${yScale(value) + 4}" text-anchor="end">${escapeHtml(yFormat(value))}</text>`
    )
    .join("");
  const xLabels = xTicks
    .map(
      (value) =>
        `<text class="lab-axis-text" x="${xScale(value)}" y="${height - pad.bottom + 24}" text-anchor="middle">${escapeHtml(xFormat(value))}</text>`
    )
    .join("");
  const paths = series
    .filter((item) => !item.scatter)
    .map((item) => {
      const path = item.values
        .map(
          (point, index) =>
            `${index === 0 ? "M" : "L"}${xScale(point.x).toFixed(2)},${yScale(point.y).toFixed(2)}`
        )
        .join(" ");
      const lastPoint = item.values[item.values.length - 1];
      return `
        <path class="lab-series" d="${path}" stroke="${item.color}" ${item.dashed ? 'stroke-dasharray="7 7"' : ""}/>
        ${
          item.showEnd
            ? `<circle cx="${xScale(lastPoint.x)}" cy="${yScale(lastPoint.y)}" r="4" fill="${item.color}"/>`
            : ""
        }
      `;
    })
    .join("");
  const observations = series
    .filter((item) => item.scatter)
    .flatMap((item) =>
      item.values.map(
        (point) =>
          `<circle class="lab-point" cx="${xScale(point.x)}" cy="${yScale(point.y)}" r="3.4" fill="${item.color}"/>`
      )
    )
    .join("");
  const markerMarkup = marker
    ? `
      <line x1="${xScale(marker.x)}" x2="${xScale(marker.x)}" y1="${pad.top}" y2="${height - pad.bottom}" class="lab-marker-line"/>
      <line x1="${pad.left}" x2="${width - pad.right}" y1="${yScale(marker.y)}" y2="${yScale(marker.y)}" class="lab-marker-line"/>
      <circle cx="${xScale(marker.x)}" cy="${yScale(marker.y)}" r="7" fill="var(--signal)" stroke="var(--paper)" stroke-width="2"/>
    `
    : "";

  return `
    <title id="labChartTitle">${escapeHtml(series.map((item) => item.name).join(", "))}</title>
    <desc id="labChartDesc">${escapeHtml(`${xLabel} against ${yLabel}`)}</desc>
    ${grid}
    ${yLabels}
    ${xLabels}
    <line class="lab-axis" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${height - pad.bottom}"/>
    <line class="lab-axis" x1="${pad.left}" x2="${width - pad.right}" y1="${height - pad.bottom}" y2="${height - pad.bottom}"/>
    ${paths}
    ${observations}
    ${markerMarkup}
    <text class="lab-axis-title" x="${width / 2}" y="${height - 12}" text-anchor="middle">${escapeHtml(xLabel)}</text>
    <text class="lab-axis-title" x="18" y="${height / 2}" text-anchor="middle" transform="rotate(-90 18 ${height / 2})">${escapeHtml(yLabel)}</text>
  `;
}

function renderCompoundLab(definition, state) {
  const months = Number(state.years) * 12;
  const monthlyReturn = Number(state.annualReturn) / 100 / 12;
  const monthlyVolatility = Number(state.volatility) / 100 / Math.sqrt(12);
  const colors = ["var(--cyan)", "var(--signal-soft)", "var(--paper)", "var(--acid)"];
  const names =
    currentLanguage === "zh"
      ? ["路径一", "路径二", "路径三", "路径四"]
      : currentLanguage === "fr"
        ? ["Trajectoire une", "Trajectoire deux", "Trajectoire trois", "Trajectoire quatre"]
        : currentLanguage === "ja"
          ? ["経路1", "経路2", "経路3", "経路4"]
          : ["Path one", "Path two", "Path three", "Path four"];
  const random = seededRandom(
    2201 + Number(state.annualReturn) * 19 + Number(state.volatility) * 31
  );
  const commonShocks = Array.from({ length: months }, () => randomNormal(random));
  const series = names.map((name, pathIndex) => {
    let value = 10000;
    let peak = value;
    let maxDrawdown = 0;
    const values = [{ x: 0, y: value }];
    const pathRandom = seededRandom(5701 + pathIndex * 977);

    for (let month = 1; month <= months; month += 1) {
      const idiosyncratic = randomNormal(pathRandom);
      const shock = monthlyReturn + monthlyVolatility * (0.72 * commonShocks[month - 1] + 0.7 * idiosyncratic);
      value *= 1 + Math.max(-0.45, Math.min(0.45, shock));
      peak = Math.max(peak, value);
      maxDrawdown = Math.max(maxDrawdown, (peak - value) / peak);
      values.push({ x: month / 12, y: value });
    }

    return {
      name,
      values,
      color: colors[pathIndex],
      showEnd: true,
      finalValue: value,
      maxDrawdown
    };
  });
  const sorted = series.map((item) => item.finalValue).sort((a, b) => a - b);
  const median = (sorted[1] + sorted[2]) / 2;
  const worstDrawdown = Math.max(...series.map((item) => item.maxDrawdown));

  return {
    chart: lineChartMarkup({
      series,
      xDomain: [0, months / 12],
      yDomain: [0, Math.max(...series.flatMap((item) => item.values.map((point) => point.y))) * 1.05],
      xLabel: uiText("Years invested", "投资年限"),
      yLabel: uiText("Portfolio value (USD)", "组合价值（美元）"),
      xFormat: (value) => `${Math.round(value)}y`,
      yFormat: (value) => `$${Math.round(value / 1000)}k`
    }),
    legend: series,
    insight: {
      en: `The middle ending value is ${formatInvestmentCurrency(median)}, while the weakest of four paths finishes at ${formatInvestmentCurrency(sorted[0])}. The gap is driven by volatility and the order of returns, not only the average return.`,
      zh: `四条路径的中位期末价值为 ${formatInvestmentCurrency(median)}，表现最弱的一条最终为 ${formatInvestmentCurrency(sorted[0])}。差距来自波动率与收益顺序，而不只是平均收益。`
    },
    metrics: [
      `$${Math.round(median).toLocaleString("en-US")}`,
      `${(worstDrawdown * 100).toFixed(0)}%`
    ]
  };
}

function renderRiskLab(definition, state) {
  const days = 150;
  const random = seededRandom(8123 + Number(state.volatility) * 100);
  const commonShocks = Array.from({ length: days }, () => randomNormal(random));
  const shockDay = 86;
  const multipliers = [0.65, 1, 1.55];
  const names =
    currentLanguage === "zh"
      ? ["低波动", "当前波动", "高波动"]
      : currentLanguage === "fr"
        ? ["Volatilité faible", "Volatilité actuelle", "Volatilité élevée"]
        : currentLanguage === "ja"
          ? ["低ボラティリティ", "現在のボラティリティ", "高ボラティリティ"]
          : ["Lower volatility", "Current volatility", "Higher volatility"];
  const colors = ["var(--cyan)", "var(--signal)", "var(--paper)"];
  const series = multipliers.map((multiplier, index) => {
    let value = 100;
    let peak = value;
    let maxDrawdown = 0;
    let worstDay = 0;
    const values = [{ x: 0, y: value }];
    const pathRandom = seededRandom(443 + index * 83);

    for (let day = 1; day <= days; day += 1) {
      const dailyMove =
        (0.025 +
          Number(state.volatility) * multiplier *
            (0.42 * commonShocks[day - 1] + 0.58 * randomNormal(pathRandom))) /
        100;
      const shock = day === shockDay ? -Number(state.shock) / 100 : 0;
      const totalMove = Math.max(-0.12, Math.min(0.12, dailyMove + shock));
      value *= 1 + totalMove;
      peak = Math.max(peak, value);
      maxDrawdown = Math.max(maxDrawdown, (peak - value) / peak);
      worstDay = Math.min(worstDay, totalMove);
      values.push({ x: day, y: value });
    }

    return {
      name: names[index],
      values,
      color: colors[index],
      maxDrawdown,
      worstDay
    };
  });
  const currentSeries = series[1];
  const highVolSeries = series[2];

  return {
    chart: lineChartMarkup({
      series,
      xDomain: [0, days],
      yDomain: [
        Math.min(...series.flatMap((item) => item.values.map((point) => point.y))) * 0.97,
        Math.max(...series.flatMap((item) => item.values.map((point) => point.y))) * 1.03
      ],
      xLabel: uiText("Trading days", "交易日"),
      yLabel: uiText("Indexed portfolio value", "指数化组合价值"),
      yFormat: (value) => value.toFixed(0)
    }),
    legend: series,
    insight: {
      en: `At the current setting, the central path suffers a ${(currentSeries.maxDrawdown * 100).toFixed(0)}% peak-to-trough loss; the higher-volatility path reaches ${(highVolSeries.maxDrawdown * 100).toFixed(0)}%. The shock is identical—the difference is how much risk each path carries.`,
      zh: `当前设置下，中间路径的最大峰谷回撤为 ${(currentSeries.maxDrawdown * 100).toFixed(0)}%，高波动路径达到 ${(highVolSeries.maxDrawdown * 100).toFixed(0)}%。两次冲击相同，差异来自路径承担的风险大小。`
    },
    metrics: [
      `${(currentSeries.maxDrawdown * 100).toFixed(1)}%`,
      `${Math.abs(currentSeries.worstDay * 100).toFixed(1)}%`
    ]
  };
}

function renderDiversifyLab(definition, state) {
  const riskyVolatility = 20;
  const safeVolatility = Number(state.safeVolatility);
  const correlation = Number(state.correlation);
  const currentWeight = Number(state.weight) / 100;
  const portfolioVolatility = (weight) => {
    const variance =
      weight ** 2 * riskyVolatility ** 2 +
      (1 - weight) ** 2 * safeVolatility ** 2 +
      2 * weight * (1 - weight) * correlation * riskyVolatility * safeVolatility;
    return Math.sqrt(variance);
  };
  const values = Array.from({ length: 21 }, (_, index) => {
    const weight = index / 20;
    return { x: weight * 100, y: portfolioVolatility(weight) };
  });
  const currentVolatility = portfolioVolatility(currentWeight);
  const riskReduction = riskyVolatility - currentVolatility;
  const minimumRiskPoint = values.reduce((best, point) =>
    point.y < best.y ? point : best
  );

  return {
    chart: lineChartMarkup({
      series: [
        {
          name:
            uiText("Portfolio volatility", "组合波动率"),
          values,
          color: "var(--signal)"
        }
      ],
      xDomain: [0, 100],
      yDomain: [0, 22],
      xLabel: uiText("Weight in risky asset (%)", "高波动资产权重"),
      yLabel: uiText("Annualized volatility (%)", "年化波动率"),
      xFormat: (value) => `${Math.round(value)}%`,
      yFormat: (value) => `${Math.round(value)}%`,
      marker: { x: currentWeight * 100, y: currentVolatility }
    }),
    legend: [
      {
        name: uiText("Portfolio volatility", "组合波动率"),
        color: "var(--signal)"
      }
    ],
    insight: {
      en: `At ${correlation.toFixed(2)} correlation, the selected mix has ${currentVolatility.toFixed(1)}% volatility. The lowest-risk allocation on this curve is ${minimumRiskPoint.x.toFixed(0)}% in the risky asset at ${minimumRiskPoint.y.toFixed(1)}% volatility.`,
      zh: `在相关系数 ${correlation.toFixed(2)} 下，当前组合波动率为 ${currentVolatility.toFixed(1)}%。曲线上风险最低的配置是高波动资产占 ${minimumRiskPoint.x.toFixed(0)}%，波动率为 ${minimumRiskPoint.y.toFixed(1)}%。`
    },
    metrics: [
      `${currentVolatility.toFixed(1)}%`,
      `${riskReduction >= 0 ? "−" : "+"}${Math.abs(riskReduction).toFixed(1)} pp`
    ]
  };
}

function renderSignalLab(definition, state) {
  const random = seededRandom(3371 + Number(state.signal) * 1009 + Number(state.noise) * 701);
  const signal = Number(state.signal);
  const noise = Number(state.noise);
  const sampleSize = Number(state.sampleSize);
  const observations = Array.from({ length: sampleSize }, (_, index) => {
    const x = index / Math.max(sampleSize - 1, 1);
    const trueValue = 0.1 + signal * 0.78 * x;
    const observed = Math.max(
      -0.15,
      Math.min(1.05, trueValue + noise * 0.22 * randomNormal(random))
    );
    return { x: index + 1, y: observed, trueValue };
  });
  const trueLine = observations.map((point) => ({ x: point.x, y: point.trueValue }));
  const observedLine = observations.map((point) => ({ x: point.x, y: point.y }));
  const meanObserved =
    observedLine.reduce((sum, point) => sum + point.y, 0) / observedLine.length;
  const meanIndex =
    observedLine.reduce((sum, point) => sum + point.x, 0) / observedLine.length;
  const covariance = observedLine.reduce(
    (sum, point) =>
      sum + (point.x - meanIndex) * (point.y - meanObserved),
    0
  );
  const xVariance = observedLine.reduce(
    (sum, point) => sum + (point.x - meanIndex) ** 2,
    0
  );
  const yVariance = observedLine.reduce(
    (sum, point) => sum + (point.y - meanObserved) ** 2,
    0
  );
  const correlation = covariance / Math.sqrt(xVariance * yVariance);

  return {
    chart: lineChartMarkup({
      series: [
        {
          name: uiText("True relationship", "真实关系"),
          values: trueLine,
          color: "var(--cyan)",
          dashed: true
        },
        {
          name: uiText("Observed data", "观测数据"),
          values: observedLine,
          color: "var(--signal)",
          scatter: true
        }
      ],
      xDomain: [1, sampleSize],
      yDomain: [-0.15, 1.05],
      xLabel: uiText("Observation", "观测顺序"),
      yLabel: uiText("Observed value", "观测值"),
      xFormat: (value) => String(Math.round(value)),
      yFormat: (value) => value.toFixed(1)
    }),
    legend: [
      {
        name: uiText("True relationship", "真实关系"),
        color: "var(--cyan)"
      },
      {
        name: uiText("Observed data", "观测数据"),
        color: "var(--signal)"
      }
    ],
    insight: {
      en: `With ${sampleSize} observations, the visible correlation is ${correlation.toFixed(2)} and the configured signal-to-noise ratio is ${(signal / noise).toFixed(2)}×. A stronger apparent pattern can still be fragile if it depends on a small sample.`,
      zh: `在 ${sampleSize} 个观测中，可见相关性为 ${correlation.toFixed(2)}，配置的信噪比为 ${(signal / noise).toFixed(2)}×。即使图形看起来更明显，只要依赖较小样本，结论仍可能很脆弱。`
    },
    metrics: [
      `${(correlation || 0).toFixed(2)}`,
      `${(signal / noise).toFixed(2)}×`
    ]
  };
}

function renderOverfitLab(definition, state) {
  const trials = Number(state.trials);
  const confidence = Number(state.confidence);
  const alpha = 1 - confidence / 100;
  const maxTrials = Math.max(100, trials);
  const values = Array.from({ length: maxTrials }, (_, index) => {
    const count = index + 1;
    return {
      x: count,
      y: (1 - (1 - alpha) ** count) * 100
    };
  });
  const expectedFalseWinners = trials * alpha;
  const probability = (1 - (1 - alpha) ** trials) * 100;

  return {
    chart: lineChartMarkup({
      series: [
        {
          name:
            currentLanguage === "zh"
              ? "至少一次伪发现"
              : uiText("At least one false discovery", "至少一次伪发现"),
          values,
          color: "var(--signal)"
        }
      ],
      xDomain: [1, maxTrials],
      yDomain: [0, 100],
      xLabel: uiText("Random strategies tested", "测试的随机策略数"),
      yLabel: uiText("Probability of a false winner (%)", "至少一次伪发现的概率"),
      xFormat: (value) => String(Math.round(value)),
      yFormat: (value) => `${Math.round(value)}%`,
      marker: { x: trials, y: probability }
    }),
    legend: [
      {
        name:
          currentLanguage === "zh"
            ? "至少一次伪发现"
            : uiText("At least one false discovery", "至少一次伪发现"),
        color: "var(--signal)"
      }
    ],
    insight: {
      en: `At the selected threshold, ${trials} random tests imply ${expectedFalseWinners.toFixed(1)} expected false winners and a ${probability.toFixed(1)}% chance of at least one. The more variants you test, the stronger the validation must be.`,
      zh: `在当前置信水平下，测试 ${trials} 个随机想法预期出现 ${expectedFalseWinners.toFixed(1)} 个假赢家，至少出现一次的概率为 ${probability.toFixed(1)}%。测试变体越多，后续验证就必须越严格。`
    },
    metrics: [
      expectedFalseWinners.toFixed(1),
      `${probability.toFixed(1)}%`
    ]
  };
}

function renderQuantLab() {
  const definition =
    labDefinitions.find((item) => item.id === activeLabId) || labDefinitions[0];
  const state = labState[definition.id];
  const step = document.getElementById("labStep");
  const title = document.getElementById("labTitle");
  const question = document.getElementById("labQuestion");
  const insight = document.getElementById("labInsight");
  const formula = document.getElementById("labFormula");
  const challenge = document.getElementById("labChallenge");
  const chartLabel = document.getElementById("labChartLabel");
  const chartUnit = document.getElementById("labChartUnit");
  const metricLabelOne = document.getElementById("labMetric1Label");
  const metricLabelTwo = document.getElementById("labMetric2Label");
  const controls = document.getElementById("labControls");
  const legend = document.getElementById("labLegend");
  const panel = document.getElementById("labPanel");
  const chart = document.getElementById("labChart");
  if (!step || !controls) return;

  document.querySelectorAll(".lab-mission").forEach((button) => {
    const selected = button.dataset.labId === definition.id;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });

  panel?.setAttribute("aria-labelledby", `lab-tab-${definition.id}`);
  step.textContent = `${uiText("EXPERIMENT", "实验")} / ${definition.step}`;
  title.textContent = definition.title[currentLanguage]
    .replace(/[.!?。！？]+$/g, "")
    .trimEnd();
  question.textContent = definition.question[currentLanguage];
  formula.textContent = definition.formula[currentLanguage];
  if (challenge) {
    challenge.textContent = labChallenges[definition.id].text[currentLanguage];
  }
  chartLabel.textContent = definition.chartLabel[currentLanguage];
  chartUnit.textContent = definition.chartUnit[currentLanguage];
  metricLabelOne.textContent = definition.metrics[0][currentLanguage];
  metricLabelTwo.textContent = definition.metrics[1][currentLanguage];

  controls.innerHTML = definition.controls
    .map(
      (control) => `
        <label class="lab-control">
          <span>${escapeHtml(control.label[currentLanguage])}<output data-output="${control.key}">${formatLabControlValue(control, state[control.key])}</output></span>
          <input type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${state[control.key]}" data-lab-input="${control.key}" aria-label="${escapeHtml(control.label[currentLanguage])}">
        </label>
      `
    )
    .join("");

  const chartWidth = Math.max(280, Math.round(chart?.clientWidth || 760));
  const chartHeight = chartWidth < 520 ? 330 : 430;
  chart?.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);

  let result;
  if (definition.id === "compound") result = renderCompoundLab(definition, state);
  if (definition.id === "risk") result = renderRiskLab(definition, state);
  if (definition.id === "diversify") result = renderDiversifyLab(definition, state);
  if (definition.id === "signal") result = renderSignalLab(definition, state);
  if (definition.id === "overfit") result = renderOverfitLab(definition, state);
  insight.textContent =
    result.insight?.[currentLanguage] || definition.insight[currentLanguage];

  document.getElementById("labChart").innerHTML = result.chart;
  document.getElementById("labMetric1Value").textContent = result.metrics[0];
  document.getElementById("labMetric2Value").textContent = result.metrics[1];
  legend.innerHTML = result.legend
    .map(
      (item) =>
        `<span><i style="background:${item.color}"></i>${escapeHtml(item.name)}</span>`
    )
    .join("");

  document.querySelectorAll("#labProgress i").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === labDefinitions.indexOf(definition));
    dot.classList.toggle("is-complete", index < labDefinitions.indexOf(definition));
  });

  const nextButton = document.querySelector("#nextLab span:first-child");
  if (nextButton) {
    const isLast = definition.id === labDefinitions[labDefinitions.length - 1].id;
    nextButton.textContent =
      currentLanguage === "zh"
        ? isLast
          ? "回到第一个实验"
          : "下一个实验"
        : isLast
          ? uiText("Restart the lab", "回到第一个实验")
          : uiText("Next experiment", "下一个实验");
  }
}

function setupQuantLab() {
  const missions = Array.from(document.querySelectorAll(".lab-mission"));
  const controls = document.getElementById("labControls");

  const activate = (labId) => {
    activeLabId = labId;
    visitedLabs.add(labId);
    renderQuantLab();
  };

  missions.forEach((button, index) => {
    button.addEventListener("click", () => activate(button.dataset.labId));
    button.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % missions.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + missions.length) % missions.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = missions.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activate(missions[nextIndex].dataset.labId);
      missions[nextIndex].focus();
    });
  });

  controls?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-lab-input]");
    if (!input) return;
    const state = labState[activeLabId];
    state[input.dataset.labInput] = Number(input.value);
    renderQuantLab();
  });

  document.getElementById("nextLab")?.addEventListener("click", () => {
    const currentIndex = labDefinitions.findIndex((item) => item.id === activeLabId);
    const nextIndex = (currentIndex + 1) % labDefinitions.length;
    activate(labDefinitions[nextIndex].id);
  });

  document.getElementById("tryLabChallenge")?.addEventListener("click", () => {
    Object.assign(labState[activeLabId], labChallenges[activeLabId].preset);
    renderQuantLab();
  });

  document.getElementById("copyLabRecord")?.addEventListener("click", async () => {
    const definition = labDefinitions.find((item) => item.id === activeLabId);
    const state = labState[activeLabId];
    const metrics = [1, 2]
      .map(
        (index) =>
          `${document.getElementById(`labMetric${index}Label`).textContent}: ${document.getElementById(`labMetric${index}Value`).textContent}`
      )
      .join("\n");
    const parameters = definition.controls
      .map(
        (control) =>
          `${control.label[currentLanguage]}: ${formatLabControlValue(control, state[control.key])}`
      )
      .join("\n");
    const record = [
      `High Table / ${definition.title[currentLanguage]}`,
      parameters,
      metrics,
      document.getElementById("labFormula").textContent
    ].join("\n\n");

    try {
      await navigator.clipboard.writeText(record);
      showToast(
        uiText(
          "Experiment parameters and results copied.",
          "实验参数与结果已复制。"
        )
      );
    } catch {
      showToast(
        uiText(
          "Clipboard access was blocked. Check this site's browser permissions.",
          "浏览器未允许访问剪贴板，请检查站点权限。"
        )
      );
    }
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderQuantLab, 180);
  });

  renderQuantLab();
}

function formatInvestmentCurrency(value, compact = false) {
  if (compact && value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}m`;
  }
  if (compact && value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatAllocationPercent(value) {
  return `${Number(value).toFixed(Number(value) % 1 === 0 ? 0 : 1)}%`;
}

function renderInvestmentBaseControls() {
  const container = document.getElementById("investmentBaseControls");
  if (!container) return;

  container.innerHTML = `
    <label class="lab-control investment-control">
      <span>${uiText("Starting capital", "初始资金")}<output data-investment-output="amount">${formatInvestmentCurrency(investmentState.amount)}</output></span>
      <input type="range" min="10000" max="500000" step="10000" value="${investmentState.amount}" data-investment-base="amount" aria-label="${uiText("Starting capital", "初始资金")}">
    </label>
    <label class="lab-control investment-control">
      <span>${uiText("Investment horizon", "投资年限")}<output data-investment-output="years">${investmentState.years} ${uiText("years", "年")}</output></span>
      <input type="range" min="1" max="30" step="1" value="${investmentState.years}" data-investment-base="years" aria-label="${uiText("Investment horizon", "投资年限")}">
    </label>
    <label class="lab-control investment-control">
      <span>${uiText("Annual fee", "年化费用")}<output data-investment-output="fee">${Number(investmentState.fee).toFixed(1)}%</output></span>
      <input type="range" min="0" max="2" step="0.1" value="${investmentState.fee}" data-investment-base="fee" aria-label="${uiText("Annual fee", "年化费用")}">
    </label>
    <label class="investment-select">
      <span>${uiText("Rebalancing", "再平衡频率")}</span>
      <select data-investment-base="rebalance" aria-label="${uiText("Rebalancing frequency", "再平衡频率")}">
        <option value="1" ${investmentState.rebalance === 1 ? "selected" : ""}>${uiText("Monthly", "每月")}</option>
        <option value="3" ${investmentState.rebalance === 3 ? "selected" : ""}>${uiText("Quarterly", "每季度")}</option>
        <option value="12" ${investmentState.rebalance === 12 ? "selected" : ""}>${uiText("Annually", "每年")}</option>
        <option value="0" ${investmentState.rebalance === 0 ? "selected" : ""}>${uiText("Never", "不再平衡")}</option>
      </select>
    </label>
  `;
}

function renderInvestmentAllocationControls() {
  const container = document.getElementById("investmentAllocationControls");
  if (!container) return;

  container.innerHTML = investmentAssets
    .map(
      (asset) => `
        <label class="allocation-control">
          <span><i style="background:${asset.color}"></i>${escapeHtml(asset.label[currentLanguage])}<output data-allocation-output="${asset.id}">${formatAllocationPercent(investmentState.allocations[asset.id])}</output></span>
          <input type="range" min="0" max="100" step="1" value="${investmentState.allocations[asset.id]}" data-allocation-input="${asset.id}" style="accent-color:${asset.color}" aria-label="${escapeHtml(asset.label[currentLanguage])}">
        </label>
      `
    )
    .join("");
}

function renderInvestmentAssumptions() {
  const container = document.getElementById("investmentAssumptions");
  if (!container) return;

  const scenario = investmentScenarios[investmentState.scenario];
  const weightedReturn = investmentAssets.reduce(
    (sum, asset) =>
      sum +
      (investmentState.allocations[asset.id] / 100) *
        scenario.returns[asset.id],
    0
  );
  const portfolioVariance = investmentAssets.reduce((outerSum, first) => {
    const firstWeight = investmentState.allocations[first.id] / 100;
    return (
      outerSum +
      investmentAssets.reduce((innerSum, second) => {
        const secondWeight = investmentState.allocations[second.id] / 100;
        const commonFactor = scenario.factorLoadings[first.id].reduce(
          (sum, loading, index) =>
            sum + loading * scenario.factorLoadings[second.id][index],
          0
        );
        const covariance =
          scenario.risks[first.id] *
          scenario.risks[second.id] *
          commonFactor;
        return innerSum + firstWeight * secondWeight * covariance;
      }, 0)
    );
  }, 0);
  const portfolioVolatility = Math.sqrt(Math.max(portfolioVariance, 0));

  container.innerHTML = `
    <div class="investment-assumptions__top">
      <span>${uiText("SCENARIO ASSUMPTIONS", "情景假设")}</span>
      <strong>${(weightedReturn * 100).toFixed(1)}% ${uiText("return", "收益")} · ${(portfolioVolatility * 100).toFixed(1)}% ${uiText("volatility", "波动")}</strong>
    </div>
    <div class="investment-assumption-table">
      ${investmentAssets
        .map(
          (asset) => `
            <div>
              <span><i style="background:${asset.color}"></i>${escapeHtml(asset.label[currentLanguage])}</span>
              <span>${(scenario.returns[asset.id] * 100).toFixed(1)}%</span>
              <span>${(scenario.risks[asset.id] * 100).toFixed(1)}%</span>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="investment-table-labels">
      <span>${uiText("Asset", "资产")}</span>
      <span>${uiText("Expected", "预期年化")}</span>
      <span>${uiText("Volatility", "年化波动")}</span>
    </div>
  `;
}

function syncInvestmentAllocationUI() {
  investmentAssets.forEach((asset) => {
    const input = document.querySelector(
      `[data-allocation-input="${asset.id}"]`
    );
    const output = document.querySelector(
      `[data-allocation-output="${asset.id}"]`
    );
    if (input) input.value = investmentState.allocations[asset.id];
    if (output) {
      output.textContent = formatAllocationPercent(
        investmentState.allocations[asset.id]
      );
    }
  });

  const bar = document.getElementById("investmentAllocationBar");
  if (bar) {
    bar.innerHTML = investmentAssets
      .map(
        (asset) =>
          `<span style="width:${investmentState.allocations[asset.id]}%;background:${asset.color}" title="${escapeHtml(asset.label[currentLanguage])}: ${formatAllocationPercent(investmentState.allocations[asset.id])}"></span>`
      )
      .join("");
  }
}

function updateInvestmentAllocation(assetId, requestedValue) {
  const keys = investmentAssets.map((asset) => asset.id);
  const oldValue = investmentState.allocations[assetId];
  const remainingKeys = keys.filter((key) => key !== assetId);
  const remainingTotal = remainingKeys.reduce(
    (sum, key) => sum + investmentState.allocations[key],
    0
  );
  const newValue = Math.max(0, Math.min(100, requestedValue));
  const delta = newValue - oldValue;

  if (delta > 0 && remainingTotal > 0) {
    const scale = Math.max(0, (remainingTotal - delta) / remainingTotal);
    remainingKeys.forEach((key) => {
      investmentState.allocations[key] *= scale;
    });
  } else if (delta < 0) {
    const freed = -delta;
    remainingKeys.forEach((key) => {
      const share =
        remainingTotal > 0
          ? investmentState.allocations[key] / remainingTotal
          : 1 / remainingKeys.length;
      investmentState.allocations[key] += freed * share;
    });
  }

  investmentState.allocations[assetId] = newValue;
  const total = keys.reduce(
    (sum, key) => sum + investmentState.allocations[key],
    0
  );
  keys.forEach((key) => {
    investmentState.allocations[key] =
      (investmentState.allocations[key] / total) * 100;
  });
  let assigned = 0;
  keys.slice(0, -1).forEach((key) => {
    investmentState.allocations[key] = Math.round(
      investmentState.allocations[key]
    );
    assigned += investmentState.allocations[key];
  });
  let overflow = Math.max(0, assigned - 100);
  for (const key of [...keys.slice(0, -1)].reverse()) {
    if (overflow <= 0) break;
    const reduction = Math.min(overflow, investmentState.allocations[key]);
    investmentState.allocations[key] -= reduction;
    assigned -= reduction;
    overflow -= reduction;
  }
  investmentState.allocations[keys[keys.length - 1]] = Math.max(
    0,
    100 - assigned
  );
  syncInvestmentAllocationUI();
  renderInvestmentAssumptions();
  syncInvestmentProfileButtons();
}

function percentile(sortedValues, probability) {
  if (sortedValues.length === 1) return sortedValues[0];
  const index = (sortedValues.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function investmentChartMarkup({
  timeSeries,
  samplePaths,
  startingValue,
  width,
  height
}) {
  const compact = width < 520;
  const pad = {
    left: compact ? 58 : 76,
    right: compact ? 18 : 28,
    top: compact ? 24 : 32,
    bottom: compact ? 52 : 60
  };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const maxX = timeSeries[timeSeries.length - 1].time;
  const maxY =
    Math.max(
      ...timeSeries.map((item) => item.p90),
      ...samplePaths.flatMap((path) => path.values.map((point) => point.value))
    ) * 1.06;
  const xScale = (value) => pad.left + (value / maxX) * innerWidth;
  const yScale = (value) =>
    pad.top + (1 - value / Math.max(maxY, 1)) * innerHeight;
  const xTickCount = compact ? 4 : 6;
  const yTickCount = compact ? 4 : 5;
  const xTicks = Array.from({ length: xTickCount }, (_, index) =>
    (maxX * index) / (xTickCount - 1)
  );
  const yTicks = Array.from({ length: yTickCount }, (_, index) =>
    (maxY * index) / (yTickCount - 1)
  );
  const areaPath = (lowKey, highKey, className) => {
    const high = timeSeries
      .map(
        (item) =>
          `${xScale(item.time).toFixed(1)},${yScale(item[highKey]).toFixed(1)}`
      )
      .join(" L");
    const low = [...timeSeries]
      .reverse()
      .map(
        (item) =>
          `${xScale(item.time).toFixed(1)},${yScale(item[lowKey]).toFixed(1)}`
      )
      .join(" L");
    return `<path class="${className}" d="M${high} L${low} Z"/>`;
  };
  const linePath = (key, className) =>
    `<path class="${className}" d="M${timeSeries
      .map(
        (item) =>
          `${xScale(item.time).toFixed(1)},${yScale(item[key]).toFixed(1)}`
      )
      .join(" L")}"/>`;
  const sampleMarkup = samplePaths
    .map(
      (path) =>
        `<path class="investment-sample-path" d="M${path.values
          .map(
            (point) =>
              `${xScale(point.time).toFixed(1)},${yScale(point.value).toFixed(1)}`
          )
          .join(" L")}"/>`
    )
    .join("");
  const medianEnd = timeSeries[timeSeries.length - 1];

  return `
    <title id="investmentChartTitle">${uiText("Simulated future portfolio value distribution", "投资组合未来价值分布")}</title>
    <desc id="investmentChartDesc">${uiText(`Two hundred simulated paths over ${investmentState.years} years`, `200 条模拟路径在 ${investmentState.years} 年后的价值范围`)}</desc>
    ${yTicks
      .map(
        (value) =>
          `<line class="lab-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${yScale(value)}" y2="${yScale(value)}"/>`
      )
      .join("")}
    ${xTicks
      .map(
        (value) =>
          `<line class="lab-grid-line lab-grid-line--vertical" x1="${xScale(value)}" x2="${xScale(value)}" y1="${pad.top}" y2="${height - pad.bottom}"/>`
      )
      .join("")}
    ${yTicks
      .map(
        (value) =>
          `<text class="lab-axis-text" x="${pad.left - 10}" y="${yScale(value) + 4}" text-anchor="end">${formatInvestmentCurrency(value, true)}</text>`
      )
      .join("")}
    ${xTicks
      .map(
        (value) =>
          `<text class="lab-axis-text" x="${xScale(value)}" y="${height - pad.bottom + 24}" text-anchor="middle">${Math.round(value)}y</text>`
      )
      .join("")}
    <line class="lab-axis" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${height - pad.bottom}"/>
    <line class="lab-axis" x1="${pad.left}" x2="${width - pad.right}" y1="${height - pad.bottom}" y2="${height - pad.bottom}"/>
    ${areaPath("p10", "p90", "investment-band investment-band--outer")}
    ${areaPath("p25", "p75", "investment-band investment-band--inner")}
    ${sampleMarkup}
    ${linePath("p10", "investment-percentile-line")}
    ${linePath("p90", "investment-percentile-line")}
    ${linePath("p50", "investment-median-line")}
    <line x1="${pad.left}" x2="${width - pad.right}" y1="${yScale(startingValue)}" y2="${yScale(startingValue)}" class="investment-start-line"/>
    <circle cx="${xScale(medianEnd.time)}" cy="${yScale(medianEnd.p50)}" r="5" fill="var(--signal)"/>
    <text class="investment-end-label" x="${xScale(medianEnd.time) - 8}" y="${yScale(medianEnd.p50) - 10}" text-anchor="end">${formatInvestmentCurrency(medianEnd.p50, true)}</text>
    <text class="lab-axis-title" x="${width / 2}" y="${height - 12}" text-anchor="middle">${uiText("Years invested", "投资年限")}</text>
    <text class="lab-axis-title" x="17" y="${height / 2}" text-anchor="middle" transform="rotate(-90 17 ${height / 2})">${uiText("Portfolio value", "组合价值")}</text>
  `;
}

function runInvestmentSimulation() {
  const chart = document.getElementById("investmentChart");
  if (!chart) return;

  const scenario = investmentScenarios[investmentState.scenario];
  const months = investmentState.years * 12;
  const pathCount = 200;
  const weights = Object.fromEntries(
    Object.entries(investmentState.allocations).map(([key, value]) => [
      key,
      value / 100
    ])
  );
  const feeMonthly = investmentState.fee / 100 / 12;
  const random = seededRandom(
    7103 +
      investmentState.years * 37 +
      investmentState.amount / 1000 +
      investmentState.rebalance * 53 +
      Object.values(investmentState.allocations).reduce(
        (sum, value) => sum + value,
        0
      ) *
        13
  );
  const monthlyValues = Array.from({ length: months + 1 }, () => []);
  const samplePaths = [];
  const finalValues = [];
  const drawdowns = [];

  for (let pathIndex = 0; pathIndex < pathCount; pathIndex += 1) {
    const holdings = Object.fromEntries(
      investmentAssets.map((asset) => [
        asset.id,
        investmentState.amount * weights[asset.id]
      ])
    );
    let value = investmentState.amount;
    let peak = value;
    let maxDrawdown = 0;
    const sampledPath = { values: [{ time: 0, value }] };
    monthlyValues[0].push(value);

    for (let month = 1; month <= months; month += 1) {
      const marketShock = randomNormal(random);
      const ratesShock = randomNormal(random);
      const goldShock = randomNormal(random);

      investmentAssets.forEach((asset) => {
        const loadings = scenario.factorLoadings[asset.id];
        const shared =
          loadings[0] * marketShock +
          loadings[1] * ratesShock +
          loadings[2] * goldShock;
        const remainingVariance = Math.max(
          0,
          1 -
            loadings.reduce(
              (sum, loading) => sum + loading * loading,
              0
            )
        );
        const assetShock =
          shared +
          Math.sqrt(remainingVariance) * randomNormal(random);
        const monthlyReturn =
          scenario.returns[asset.id] / 12 +
          (scenario.risks[asset.id] / Math.sqrt(12)) * assetShock;
        holdings[asset.id] *=
          1 +
          Math.max(-0.45, Math.min(0.45, monthlyReturn - feeMonthly));
      });

      value = investmentAssets.reduce(
        (sum, asset) => sum + holdings[asset.id],
        0
      );
      if (
        investmentState.rebalance > 0 &&
        month % investmentState.rebalance === 0
      ) {
        investmentAssets.forEach((asset) => {
          holdings[asset.id] = value * weights[asset.id];
        });
      }
      peak = Math.max(peak, value);
      maxDrawdown = Math.max(maxDrawdown, (peak - value) / peak);
      monthlyValues[month].push(value);

      if (month % 3 === 0 || month === months) {
        sampledPath.values.push({
          time: month / 12,
          value
        });
      }
    }

    if (pathIndex < 22) samplePaths.push(sampledPath);
    finalValues.push(value);
    drawdowns.push(maxDrawdown);
  }

  const timeSeries = monthlyValues
    .map((values, month) => {
      if (month % 3 !== 0 && month !== 0 && month !== months) return null;
      const sorted = [...values].sort((a, b) => a - b);
      return {
        time: month / 12,
        p10: percentile(sorted, 0.1),
        p25: percentile(sorted, 0.25),
        p50: percentile(sorted, 0.5),
        p75: percentile(sorted, 0.75),
        p90: percentile(sorted, 0.9)
      };
    })
    .filter(Boolean);
  const sortedFinal = [...finalValues].sort((a, b) => a - b);
  const sortedDrawdowns = [...drawdowns].sort((a, b) => a - b);
  const medianOutcome = percentile(sortedFinal, 0.5);
  const lowOutcome = percentile(sortedFinal, 0.1);
  const probabilityOfLoss =
    finalValues.filter((value) => value < investmentState.amount).length /
    finalValues.length;
  const medianDrawdown = percentile(sortedDrawdowns, 0.5);
  const chartWidth = Math.max(300, Math.round(chart.clientWidth || 760));
  const chartHeight = chartWidth < 520 ? 330 : 430;
  chart.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
  chart.innerHTML = investmentChartMarkup({
    timeSeries,
    samplePaths,
    startingValue: investmentState.amount,
    width: chartWidth,
    height: chartHeight
  });

  document.getElementById("investmentMedian").textContent =
    formatInvestmentCurrency(medianOutcome, true);
  document.getElementById("investmentLow").textContent =
    formatInvestmentCurrency(lowOutcome, true);
  document.getElementById("investmentLoss").textContent =
    `${(probabilityOfLoss * 100).toFixed(0)}%`;
  document.getElementById("investmentDrawdown").textContent =
    `${(medianDrawdown * 100).toFixed(0)}%`;
  document.getElementById("investmentScenarioLabel").textContent =
    currentLanguage === "zh"
      ? `${scenario.label.zh} · ${investmentState.rebalance ? `每 ${investmentState.rebalance} 个月再平衡` : "不再平衡"} · 200 条路径`
      : currentLanguage === "fr"
        ? `${scenario.label.fr.toUpperCase()} · ${investmentState.rebalance ? `RÉÉQUILIBRAGE TOUS LES ${investmentState.rebalance} MOIS` : "SANS RÉÉQUILIBRAGE"} · 200 TRAJECTOIRES`
        : currentLanguage === "ja"
          ? `${scenario.label.ja}シナリオ・${investmentState.rebalance ? `${investmentState.rebalance}か月ごとにリバランス` : "リバランスなし"}・200経路`
          : `${scenario.label.en.toUpperCase()} SCENARIO · ${investmentState.rebalance ? `${investmentState.rebalance}-MONTH REBALANCE` : "NO REBALANCING"} · 200 PATHS`;

  const medianMultiple = medianOutcome / investmentState.amount;
  document.getElementById("investmentInsight").textContent =
    currentLanguage === "zh"
      ? `${scenario.description.zh} 模拟中位期末价值是初始资金的 ${medianMultiple.toFixed(1)} 倍，约 ${(probabilityOfLoss * 100).toFixed(0)}% 的路径最终低于本金。`
      : currentLanguage === "fr"
        ? `${scenario.description.fr} La valeur finale médiane représente ${medianMultiple.toFixed(1)} fois le capital initial, et environ ${(probabilityOfLoss * 100).toFixed(0)} % des trajectoires terminent sous le montant initial.`
        : currentLanguage === "ja"
          ? `${scenario.description.ja} 最終価値の中央値は初期資本の${medianMultiple.toFixed(1)}倍で、約${(probabilityOfLoss * 100).toFixed(0)}%の経路が元本を下回ります。`
          : `${scenario.description.en} The median ending value is ${medianMultiple.toFixed(1)}× starting capital, while about ${(probabilityOfLoss * 100).toFixed(0)}% of paths finish below the original amount.`;
}

function exportInvestmentResults() {
  const scenario = investmentScenarios[investmentState.scenario];
  const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [
    ["High Table Investment Simulator"],
    ["Scenario", scenario.label[currentLanguage]],
    ["Starting capital", investmentState.amount],
    ["Investment horizon", investmentState.years],
    ["Annual fee %", investmentState.fee],
    [
      "Rebalancing",
      investmentState.rebalance
        ? `${investmentState.rebalance} months`
        : "Never"
    ],
    [],
    ["Asset", "Allocation %", "Expected return %", "Volatility %"],
    ...investmentAssets.map((asset) => [
      asset.label[currentLanguage],
      investmentState.allocations[asset.id].toFixed(0),
      (scenario.returns[asset.id] * 100).toFixed(2),
      (scenario.risks[asset.id] * 100).toFixed(2)
    ]),
    [],
    ["Median outcome", document.getElementById("investmentMedian").textContent],
    ["10th percentile", document.getElementById("investmentLow").textContent],
    ["Probability of loss", document.getElementById("investmentLoss").textContent],
    ["Median max drawdown", document.getElementById("investmentDrawdown").textContent]
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "high-table-investment-simulation.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(
    uiText(
      "Scenario inputs and simulation results exported.",
      "情景参数与模拟结果已导出。"
    )
  );
}

function syncInvestmentProfileButtons() {
  document.querySelectorAll("[data-investment-profile]").forEach((button) => {
    const profile = investmentProfiles[button.dataset.investmentProfile];
    const selected = investmentAssets.every(
      (asset) =>
        Math.round(investmentState.allocations[asset.id]) ===
        profile[asset.id]
    );
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function renderInvestmentInterface() {
  renderInvestmentBaseControls();
  renderInvestmentAllocationControls();
  syncInvestmentAllocationUI();

  document.querySelectorAll("[data-investment-scenario]").forEach((button) => {
    const selected = button.dataset.investmentScenario === investmentState.scenario;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  syncInvestmentProfileButtons();

  renderInvestmentAssumptions();
  runInvestmentSimulation();
}

function setupInvestmentLab() {
  const baseControls = document.getElementById("investmentBaseControls");
  const allocationControls = document.getElementById(
    "investmentAllocationControls"
  );

  baseControls?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-investment-base]");
    if (!input) return;
    const key = input.dataset.investmentBase;
    investmentState[key] = Number(input.value);
    const output = document.querySelector(
      `[data-investment-output="${key}"]`
    );
    if (output) {
      if (key === "amount") output.textContent = formatInvestmentCurrency(investmentState.amount);
      if (key === "years") {
        output.textContent = `${investmentState.years} ${uiText("years", "年")}`;
      }
      if (key === "fee") output.textContent = `${Number(investmentState.fee).toFixed(1)}%`;
    }
  });

  allocationControls?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-allocation-input]");
    if (!input) return;
    updateInvestmentAllocation(
      input.dataset.allocationInput,
      Number(input.value)
    );
  });

  document.querySelectorAll("[data-investment-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      investmentState.scenario = button.dataset.investmentScenario;
      renderInvestmentInterface();
    });
  });

  document.querySelectorAll("[data-investment-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      investmentState.allocations = {
        ...investmentProfiles[button.dataset.investmentProfile]
      };
      renderInvestmentInterface();
    });
  });

  document
    .getElementById("runInvestmentSimulation")
    ?.addEventListener("click", runInvestmentSimulation);
  document
    .getElementById("exportInvestmentCsv")
    ?.addEventListener("click", exportInvestmentResults);

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(runInvestmentSimulation, 180);
  });

  renderInvestmentInterface();
}

function scoreBarChartMarkup({ labels, values, width, height }) {
  const compact = width < 520;
  const pad = {
    left: compact ? 48 : 62,
    right: compact ? 14 : 24,
    top: compact ? 26 : 34,
    bottom: compact ? 54 : 64
  };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const gap = compact ? 10 : 22;
  const barWidth = (innerWidth - gap * (values.length - 1)) / values.length;
  const yScale = (value) => pad.top + (1 - value / 100) * innerHeight;

  return `
    <title id="topicChartTitle">${uiText("Team capability signal profile", "团队能力信号画像")}</title>
    <desc id="topicChartDesc">${uiText("Illustrative scores for analytical rigor, communication and judgment", "分析严谨、沟通表达与判断力的示意性评分")}</desc>
    ${[0, 25, 50, 75, 100]
      .map(
        (value) =>
          `<line class="lab-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${yScale(value)}" y2="${yScale(value)}"/>
           <text class="lab-axis-text" x="${pad.left - 10}" y="${yScale(value) + 4}" text-anchor="end">${value}</text>`
      )
      .join("")}
    ${values
      .map((value, index) => {
        const x = pad.left + index * (barWidth + gap);
        const y = yScale(value);
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${height - pad.bottom - y}" rx="0" fill="var(--signal)" opacity="${0.62 + index * 0.12}"/>
          <text class="topic-bar-value" x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle">${Math.round(value)}</text>
          <text class="lab-axis-text" x="${x + barWidth / 2}" y="${height - pad.bottom + 24}" text-anchor="middle">${escapeHtml(labels[index])}</text>
        `;
      })
      .join("")}
    <line class="lab-axis" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${height - pad.bottom}"/>
    <line class="lab-axis" x1="${pad.left}" x2="${width - pad.right}" y1="${height - pad.bottom}" y2="${height - pad.bottom}"/>
  `;
}

function renderResearchTopicChart(topicId) {
  const topic = researchTopics[topicId];
  const state = researchTopicState[topicId];
  const chart = document.getElementById("topicChart");
  const chartWidth = Math.max(300, Math.round(chart?.clientWidth || 760));
  const chartHeight = chartWidth < 520 ? 330 : 430;
  chart?.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
  const chartOptions = { chartId: "topicChart" };

  if (topicId === "liquidity") {
    const stress = Number(state.stress);
    const orderSize = Number(state.orderSize);
    const spread = 2 + stress * 0.16;
    const values = Array.from({ length: 100 }, (_, index) => {
      const size = index + 1;
      return {
        x: size,
        y: 0.7 + size * 0.11 * (1 + stress / 35)
      };
    });
    const currentImpact =
      values[Math.max(0, Math.min(values.length - 1, orderSize - 1))].y;
    return {
      chart: lineChartMarkup({
        ...chartOptions,
        series: [
          {
            name: uiText("Estimated impact", "估计冲击"),
            values,
            color: "var(--signal)"
          }
        ],
        xDomain: [1, 100],
        yDomain: [0, Math.max(...values.map((point) => point.y)) * 1.08],
        xLabel: uiText("Order size (% ADV)", "订单规模（% ADV）"),
        yLabel: uiText("Estimated price impact (bps)", "估计价格冲击（基点）"),
        xFormat: (value) => `${Math.round(value)}%`,
        yFormat: (value) => `${value.toFixed(1)}`
      }),
      metrics: [`${spread.toFixed(1)} bps`, `${currentImpact.toFixed(1)} bps`],
      insight:
        currentLanguage === "zh"
          ? `在市场压力为 ${stress}% 时，价差估计升至 ${spread.toFixed(1)} 个基点；当前规模订单的冲击约为 ${currentImpact.toFixed(1)} 个基点。压力会同时降低深度并放大执行成本。`
          : currentLanguage === "fr"
            ? `Avec une tension de marché de ${stress} %, le spread estimé atteint ${spread.toFixed(1)} pb et l’ordre actuel subit environ ${currentImpact.toFixed(1)} pb d’impact. La tension réduit la profondeur et amplifie le coût d’exécution.`
            : currentLanguage === "ja"
              ? `市場ストレス${stress}%では推定スプレッドが${spread.toFixed(1)}bpまで上昇し、現在の注文規模では約${currentImpact.toFixed(1)}bpの価格インパクトが生じます。ストレスは市場深度を低下させ、執行コストを押し上げます。`
              : `At ${stress}% market stress, the estimated spread rises to ${spread.toFixed(1)} bps and the current order size faces roughly ${currentImpact.toFixed(1)} bps of impact. Stress reduces depth while amplifying execution cost.`
    };
  }

  if (topicId === "factor-decay") {
    const halfLife = Number(state.halfLife);
    const initialAlpha = Number(state.initialAlpha);
    const values = Array.from({ length: 49 }, (_, month) => ({
      x: month,
      y: initialAlpha * 0.5 ** (month / halfLife)
    }));
    const remaining24 = initialAlpha * 0.5 ** (24 / halfLife);
    return {
      chart: lineChartMarkup({
        ...chartOptions,
        series: [
          {
            name: uiText("Remaining signal", "剩余信号"),
            values,
            color: "var(--signal)"
          }
        ],
        xDomain: [0, 48],
        yDomain: [0, initialAlpha * 1.08],
        xLabel: uiText("Months after publication", "公开后的月份"),
        yLabel: uiText("Remaining signal (bps)", "剩余信号（基点）"),
        xFormat: (value) => `${Math.round(value)}m`,
        yFormat: (value) => value.toFixed(1)
      }),
      metrics: [`${halfLife}m`, `${remaining24.toFixed(1)} bps`],
      insight:
        currentLanguage === "zh"
          ? `若半衰期为 ${halfLife} 个月，24 个月后只剩 ${remaining24.toFixed(1)} 个基点信号。研究应把交易成本与持有期同时纳入容量判断。`
          : currentLanguage === "fr"
            ? `Avec une demi-vie de ${halfLife} mois, il ne reste que ${remaining24.toFixed(1)} pb de signal après 24 mois. L’analyse de capacité doit combiner dégradation, coûts de transaction et durée de détention.`
            : currentLanguage === "ja"
              ? `半減期が${halfLife}か月の場合、24か月後には${remaining24.toFixed(1)}bpのシグナルしか残りません。キャパシティ分析では減衰、取引コスト、保有期間を同時に考える必要があります。`
              : `With a ${halfLife}-month half-life, only ${remaining24.toFixed(1)} bps of signal remains after 24 months. Capacity analysis should combine decay with transaction costs and holding period.`
    };
  }

  if (topicId === "model-governance") {
    const threshold = Number(state.threshold);
    const checkDays = Number(state.checkDays);
    const checksPerYear = 252 / checkDays;
    const values = Array.from({ length: 41 }, (_, index) => {
      const sigma = 1 + index * 0.1;
      return {
        x: sigma,
        y: checksPerYear * Math.exp(-1.05 * sigma)
      };
    });
    const expectedAlerts = checksPerYear * Math.exp(-1.05 * threshold);
    const reviewHours = (expectedAlerts * 0.25) / 12;
    return {
      chart: lineChartMarkup({
        ...chartOptions,
        series: [
          {
            name: uiText("Expected alerts", "预计警报"),
            values,
            color: "var(--signal)"
          }
        ],
        xDomain: [1, 5],
        yDomain: [0, Math.max(...values.map((point) => point.y)) * 1.08],
        xLabel: uiText("Alert threshold (standard deviations)", "警报阈值（标准差）"),
        yLabel: uiText("Expected alerts per year", "每年预计警报数"),
        xFormat: (value) => `${value.toFixed(1)}σ`,
        yFormat: (value) => value.toFixed(0)
      }),
      metrics: [
        expectedAlerts.toFixed(1),
        `${reviewHours.toFixed(1)} h`
      ],
      insight:
        currentLanguage === "zh"
          ? `在当前设定下，预计每年 ${expectedAlerts.toFixed(1)} 次警报，每月约 ${reviewHours.toFixed(1)} 小时复核量。更低阈值更敏感，但会显著提高误报负担。`
          : currentLanguage === "fr"
            ? `Le paramétrage actuel implique ${expectedAlerts.toFixed(1)} alertes par an et environ ${reviewHours.toFixed(1)} heures de revue par mois. Un seuil plus bas est plus sensible mais augmente fortement la charge de fausses alertes.`
            : currentLanguage === "ja"
              ? `現在の設定では年間${expectedAlerts.toFixed(1)}件のアラートと月約${reviewHours.toFixed(1)}時間のレビュー負荷が見込まれます。閾値を下げると検知は敏感になりますが、誤検知の負担も大きくなります。`
              : `The current setting implies ${expectedAlerts.toFixed(1)} alerts per year and about ${reviewHours.toFixed(1)} review hours per month. Lower thresholds are more sensitive but create a larger false-alarm workload.`
    };
  }

  if (topicId === "law-and-markets") {
    const stringency = Number(state.stringency);
    const enforcement = Number(state.enforcement);
    const burdenSeries = Array.from({ length: 21 }, (_, index) => {
      const level = index * 5;
      return {
        x: level,
        y: level * (0.35 + 0.65 * (enforcement / 100))
      };
    });
    const adaptationSeries = Array.from({ length: 21 }, (_, index) => {
      const level = index * 5;
      return {
        x: level,
        y: level * 0.62 * (1 - enforcement / 120)
      };
    });
    const burden = stringency * (0.35 + 0.65 * (enforcement / 100));
    const adaptationGap = stringency * 0.62 * (1 - enforcement / 120);
    return {
      chart: lineChartMarkup({
        ...chartOptions,
        series: [
          {
            name: uiText("Direct compliance burden", "直接合规负担"),
            values: burdenSeries,
            color: "var(--signal)"
          },
          {
            name: uiText("Adaptation gap", "适应缺口"),
            values: adaptationSeries,
            color: "var(--cyan)",
            dashed: true
          }
        ],
        xDomain: [0, 100],
        yDomain: [0, 110],
        xLabel: uiText("Rule stringency", "规则严格度"),
        yLabel: uiText("Illustrative economic burden index", "示意性经济负担指数"),
        xFormat: (value) => `${Math.round(value)}%`,
        yFormat: (value) => Math.round(value)
      }),
      metrics: [burden.toFixed(0), adaptationGap.toFixed(0)],
      insight:
        currentLanguage === "zh"
          ? `当前组合的直接负担指数为 ${burden.toFixed(0)}，适应缺口为 ${adaptationGap.toFixed(0)}。规则强度必须与执行概率和企业的调整能力一起分析。`
          : currentLanguage === "fr"
            ? `La combinaison actuelle produit un indice de charge de ${burden.toFixed(0)} et un écart d’adaptation de ${adaptationGap.toFixed(0)}. La rigueur de la règle doit être analysée avec son application et la capacité d’ajustement des acteurs.`
            : currentLanguage === "ja"
              ? `現在の組み合わせでは負担指数${burden.toFixed(0)}、適応ギャップ${adaptationGap.toFixed(0)}です。規制の強さは執行確率と市場参加者の調整能力と併せて分析すべきです。`
              : `The current combination produces a burden index of ${burden.toFixed(0)} and an adaptation gap of ${adaptationGap.toFixed(0)}. Rule strength must be analyzed alongside enforcement and adjustment capacity.`
    };
  }

  if (topicId === "global-contagion") {
    const shock = Number(state.shockSize);
    const contagion = Number(state.contagion) / 100;
    const source = [];
    const europe = [];
    const asia = [];
    for (let day = 0; day <= 60; day += 1) {
      source.push({ x: day, y: shock * Math.exp(-day / 14) });
      europe.push({
        x: day,
        y:
          shock *
          contagion *
          0.7 *
          (1 - Math.exp(-day / 4)) *
          Math.exp(-day / 42)
      });
      asia.push({
        x: day,
        y:
          shock *
          contagion *
          0.54 *
          (1 - Math.exp(-day / 7)) *
          Math.exp(-day / 48)
      });
    }
    const europePeak = Math.max(...europe.map((point) => point.y));
    const asiaPeak = Math.max(...asia.map((point) => point.y));
    return {
      chart: lineChartMarkup({
        ...chartOptions,
        series: [
          {
            name: uiText("Source market", "来源市场"),
            values: source,
            color: "var(--paper)"
          },
          {
            name: uiText("Europe", "欧洲"),
            values: europe,
            color: "var(--signal)"
          },
          {
            name: uiText("Asia", "亚洲"),
            values: asia,
            color: "var(--cyan)"
          }
        ],
        xDomain: [0, 60],
        yDomain: [0, shock * 1.08],
        xLabel: uiText("Days after event", "事件后天数"),
        yLabel: uiText("Impact magnitude (%)", "峰值冲击幅度"),
        xFormat: (value) => `${Math.round(value)}d`,
        yFormat: (value) => `${value.toFixed(1)}%`
      }),
      metrics: [`${europePeak.toFixed(2)}%`, `${asiaPeak.toFixed(2)}%`],
      insight:
        currentLanguage === "zh"
          ? `在 ${contagion * 100}% 的传染强度下，欧洲峰值影响约 ${europePeak.toFixed(2)}%，亚洲约 ${asiaPeak.toFixed(2)}%。时间延迟与市场结构决定冲击是否真正同步。`
          : currentLanguage === "fr"
            ? `Avec une contagion de ${Math.round(contagion * 100)} %, l’impact maximal atteint environ ${europePeak.toFixed(2)} % en Europe et ${asiaPeak.toFixed(2)} % en Asie. Le décalage temporel et la structure de marché déterminent si les chocs sont réellement synchronisés.`
            : currentLanguage === "ja"
              ? `伝播強度${Math.round(contagion * 100)}%では、欧州の最大影響は約${europePeak.toFixed(2)}%、アジアは約${asiaPeak.toFixed(2)}%です。時間差と市場構造がショックの同期性を左右します。`
              : `At ${Math.round(contagion * 100)}% contagion strength, peak impact is about ${europePeak.toFixed(2)}% in Europe and ${asiaPeak.toFixed(2)}% in Asia. Timing and market structure determine whether shocks are genuinely synchronized.`
    };
  }

  const values = [
    Number(state.analysis),
    Number(state.communication),
    Number(state.judgment)
  ];
  const labels =
    currentLanguage === "zh"
      ? ["分析", "沟通", "判断"]
      : currentLanguage === "fr"
        ? ["Analyse", "Communication", "Jugement"]
        : ["Analysis", "Communication", "Judgment"];
  const weightedSignal =
    values[0] * 0.45 + values[1] * 0.25 + values[2] * 0.3;
  const weakestIndex = values.indexOf(Math.min(...values));
  return {
    chart: scoreBarChartMarkup({
      labels,
      values,
      width: chartWidth,
      height: chartHeight
    }),
    metrics: [
      weightedSignal.toFixed(0),
      labels[weakestIndex]
    ],
    insight:
      currentLanguage === "zh"
        ? `当前加权信号为 ${weightedSignal.toFixed(0)}，最弱维度是${labels[weakestIndex]}。评分只能作为研究指标，不能替代对真实表现的长期跟踪。`
        : currentLanguage === "fr"
          ? `Le signal pondéré est de ${weightedSignal.toFixed(0)}, la dimension la plus faible étant ${labels[weakestIndex]}. Une grille reste un indicateur de recherche et ne remplace pas le suivi de la performance réelle.`
          : currentLanguage === "ja"
            ? `加重シグナルは${weightedSignal.toFixed(0)}で、最も弱い項目は${labels[weakestIndex]}です。評価ルーブリックは研究指標であり、長期的な実績データの代替ではありません。`
            : `The weighted signal is ${weightedSignal.toFixed(0)}, with ${labels[weakestIndex]} as the weakest dimension. A rubric is a research measure, not a substitute for long-run performance data.`
  };
}

function renderResearchTopic(topicId) {
  const topic = researchTopics[topicId];
  if (!topic) return;
  const state = researchTopicState[topicId];
  const topicIndex = Object.keys(researchTopics).indexOf(topicId);

  activeResearchTopicId = topicId;
  document.getElementById("topicCategory").textContent =
    topic.category[currentLanguage];
  document.getElementById("topicKicker").textContent =
    currentLanguage === "zh"
      ? `研究笔记 / ${String(topicIndex + 1).padStart(2, "0")}`
      : currentLanguage === "fr"
        ? `NOTE DE RECHERCHE / ${String(topicIndex + 1).padStart(2, "0")}`
        : `RESEARCH NOTE / ${String(topicIndex + 1).padStart(2, "0")}`;
  document.getElementById("topicTitle").textContent =
    topic.title[currentLanguage]
      .replace(/[.!?。！？]+$/g, "")
      .trimEnd();
  document.getElementById("topicLede").textContent = topic.lede[currentLanguage];
  document.getElementById("topicWhy").textContent = topic.why[currentLanguage];
  document.getElementById("topicQuestion").textContent =
    topic.question[currentLanguage];
  document.getElementById("topicConcepts").innerHTML = topic.concepts[
    currentLanguage
  ]
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  document.getElementById("topicMethods").innerHTML = topic.methods[
    currentLanguage
  ]
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  document.getElementById("topicOutputList").innerHTML = topic.outputs[
    currentLanguage
  ]
    .map(
      (item, index) =>
        `<span><i>${String(index + 1).padStart(2, "0")}</i>${escapeHtml(item)}</span>`
    )
    .join("");
  document.getElementById("topicExplorerLabel").textContent =
    topic.chartLabel[currentLanguage];
  document.getElementById("topicMetric1Label").textContent =
    topic.metricLabels[0][currentLanguage];
  document.getElementById("topicMetric2Label").textContent =
    topic.metricLabels[1][currentLanguage];

  const controls = document.getElementById("topicControls");
  controls.innerHTML = topic.controls
    .map(
      (control) => `
        <label class="lab-control">
          <span>${escapeHtml(control.label[currentLanguage])}<output data-topic-output="${control.key}">${formatLabControlValue(control, state[control.key])}</output></span>
          <input type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${state[control.key]}" data-topic-control="${control.key}" aria-label="${escapeHtml(control.label[currentLanguage])}">
        </label>
      `
    )
    .join("");

  const result = renderResearchTopicChart(topicId);
  document.getElementById("topicChart").innerHTML = result.chart;
  document.getElementById("topicMetric1Value").textContent = result.metrics[0];
  document.getElementById("topicMetric2Value").textContent = result.metrics[1];
  document.getElementById("topicInsight").textContent = result.insight;

  const previous =
    labDefinitions.length && Object.keys(researchTopics)[
      (topicIndex - 1 + Object.keys(researchTopics).length) %
        Object.keys(researchTopics).length
    ];
  const next =
    Object.keys(researchTopics)[
      (topicIndex + 1) % Object.keys(researchTopics).length
    ];
  document.getElementById("previousTopic").dataset.topicTarget = previous;
  document.getElementById("nextTopic").dataset.topicTarget = next;
}

function setupResearchTopicPage() {
  const controls = document.getElementById("topicControls");
  controls?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-topic-control]");
    if (!input || !activeResearchTopicId) return;
    const key = input.dataset.topicControl;
    const topic = researchTopics[activeResearchTopicId];
    const control = topic.controls.find((item) => item.key === key);
    researchTopicState[activeResearchTopicId][key] = Number(input.value);
    const output = document.querySelector(`[data-topic-output="${key}"]`);
    if (output) {
      output.textContent = formatLabControlValue(
        control,
        researchTopicState[activeResearchTopicId][key]
      );
    }
    const result = renderResearchTopicChart(activeResearchTopicId);
    document.getElementById("topicChart").innerHTML = result.chart;
    document.getElementById("topicMetric1Value").textContent = result.metrics[0];
    document.getElementById("topicMetric2Value").textContent = result.metrics[1];
    document.getElementById("topicInsight").textContent = result.insight;
  });

  ["previousTopic", "nextTopic"].forEach((buttonId) => {
    document.getElementById(buttonId)?.addEventListener("click", () => {
      const target = document.getElementById(buttonId).dataset.topicTarget;
      if (target) activateAppRoute(target, true);
    });
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!activeResearchTopicId) return;
      const result = renderResearchTopicChart(activeResearchTopicId);
      document.getElementById("topicChart").innerHTML = result.chart;
      document.getElementById("topicMetric1Value").textContent = result.metrics[0];
      document.getElementById("topicMetric2Value").textContent = result.metrics[1];
      document.getElementById("topicInsight").textContent = result.insight;
    }, 180);
  });
}

function showToast(message, duration = 4800) {
  const toast = document.getElementById("installToast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, duration);
}

function setupPwa() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Installation remains available through the browser menu if caching is blocked.
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
  });

  document.querySelectorAll("[data-install-app]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (installPrompt) {
        installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
        return;
      }

      showToast(
        uiText(
          "Use your browser menu and choose “Install app” or “Add to Home Screen.” The High Table shortcut will open in its own window.",
          "请在浏览器菜单中选择“安装应用”或“添加到桌面”。安装后可从桌面直接打开高桌。"
        ),
        7000
      );
    });
  });

  window.addEventListener("appinstalled", () => {
    showToast(
      uiText(
        "The High Table desktop app has been installed.",
        "高桌桌面应用已安装。"
      )
    );
  });
}

function setupDialogs() {
  const companyGrid = document.getElementById("companyGrid");
  const careerGrid = document.getElementById("careerGrid");
  const companyDialog = document.getElementById("companyDialog");
  const careerDialog = document.getElementById("careerDialog");

  companyGrid?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-company-id]");
    if (card) openCompanyDialog(card.dataset.companyId);
  });

  careerGrid?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-career-id]");
    if (card) openCareerDialog(card.dataset.careerId);
  });

  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) {
      closeButton.closest("dialog")?.close();
      return;
    }

    if (event.target instanceof HTMLDialogElement && event.target.open) {
      event.target.close();
    }
  });

  companyDialog?.addEventListener("close", () => {
    currentCompany = null;
    const anyOpen = Array.from(document.querySelectorAll("dialog")).some(
      (dialog) => dialog.open
    );
    document.body.classList.toggle("dialog-open", anyOpen);
  });

  careerDialog?.addEventListener("close", () => {
    currentCareer = null;
    const anyOpen = Array.from(document.querySelectorAll("dialog")).some(
      (dialog) => dialog.open
    );
    document.body.classList.toggle("dialog-open", anyOpen);
  });
}

function setupReveals() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -5% 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

function updateNewYorkTime() {
  const clock = document.getElementById("nyTime");
  if (!clock) return;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  clock.textContent = formatter.format(new Date());
}

function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  materializeLocalizedData();
  setupLanguage();
  setupNavigation();
  setupTabs(".research-tab", ".research-panel");
  setupTabs(".interview-step", ".interview-panel");
  setupCompetitionFilters();
  setupCompanyFilters();
  setupResumeLab();
  setupQuestionDrill();
  setupQuantLab();
  setupInvestmentLab();
  setupResearchTopicPage();
  setupLabRoutes();
  setupDialogs();
  setupPwa();
  setupReveals();
  updateNewYorkTime();
  window.setInterval(updateNewYorkTime, 1000);
}

init();
