
    export enum XBRLSubmissionTypes
    {
        ReportingSchedule = 0,
        GeneralSubmission = 1
    }


    export enum ExcelCellTypes
    {
        CELL_TYPE_BLANK = 3,
        CELL_TYPE_BOOLEAN = 4,
        CELL_TYPE_ERROR = 5,
        CELL_TYPE_FORMULA = 2,
        CELL_TYPE_NUMERIC = 0,
        CELL_TYPE_STRING = 1,
    }

    export enum FileTypes
    {
        Instance = 1,
        HTML = 2,
        Excel_Attachment = 3,
        ValidationXml=4
    }


    export enum ValidationTypes
    {
        PositiveDecimal,
        Decimal,
        PositiveNonDecimal,
        NonDecimal,
        Currency,
        Percentage,
        DatesDDMMYYYY,
        DatesDDMMYY,
        DatesDD_MMM_YYYY,
        Email,
        URL,
        IPAddress,
        Phone,
        Zip,
        QFCNum,
        BreachNum,

        WebURL,
        Password,
        Passport,
        NationalIdNumber,
        IndividualDtlsTxtValidation,
        IndvidualDtlsPhones,
        ZipCode,
        alphnumerichyphen,
        TextDataValidation,
        PhoneDataValidation,
        NameFeildsValidation,
        QFCNumber

    }


    // Range 15001-15100
    export enum ServicePath
    {
        FirmServiceUrl = 15001,
       // AIServiceUrl = 15016,
        ClientXBRL = 15786 // By IRIS
    }

    //User Friendly Messages ID for USER REGISTRATION PAGE
    //Range 1000 to 1999

    export enum UserRegistrationPage
    {
        QFCLicenseNo = 1000,
        EmailAddress = 1001,
        DateOfBirth = 1002,
        PasswordInEmail = 1003,

        TempUserCredentialsNotValid = 1004,

        EnterPassword = 1005,
        ReTypePassword = 1006,
        PasswordsNotMatched = 1007,
        SelectFirstQuestion = 1008,
        FirstQuestionAnswer = 1009,
        SelectSecondQuestion = 1010,
        SecondQuestionAnswer = 1011,
        SelectThirdQuestion = 1012,
        ThirdQuestionAnswer = 1013,
        EnterRegistrationCaptchCode = 1014,
        PasswordWithSpecialCharacter = 1015,

        ValidDateOfDirth = 1016,
        UserRegistrationPageLink = 1017,

        AccountAlreadyRegistered = 1018,
        InvalidEmailaddress = 1019,

        UserProfileSaved = 1020,
        ErroUserProfile = 1021,
        PleaseValidatePageData = 1022,
        UserProfileHelpInfo = 1023,

        EnterDifferentEmailId = 1024,
        NewUserNameHelpInfo = 1025,

        EnterNewEmailID = 1026,
        ReEnterNewEmailID = 1027,


    }

    export enum LoginPage
    {
        EnterUserName = 1100,
        ProvideAnswerToQuestion = 1101,
        EnterPassword = 1102,
        EnterCode = 1103,
        EnterCorrectCode = 1104,
        LoggedInOtherSystem = 1105,
        AccountLocked = 1106,
        InvalidUserCredentials = 1107,
        AccountDeactivated = 1108,
        AccessDeniedMessage = 1109,
        RequestValidationError = 1110,
        SessionIsActive = 1111,
        BrowserCompatibilityInfo = 1112,
        SiteUnderMaintainanceFlag = 1113,
        SiteUnderMaintainanceMessage = 1114,
        XBRLDownloadLink = 1793
    }


    export enum AdministrationPage
    {
        EnterIndividualName = 1200,
        EnterIndividualJobTitle = 1201,
        EnterIndividualDateOfBirth = 1202,
        EnterIndividualNationality = 1203,
        EmailAddressesNotMatched = 1204,
        EnterValidEmailAddress = 1205,
        EnterEmailAddress = 1206,
        AdministrationCaptchaCode = 1207,

        UserDeactivatedSuccessfully = 1208,
        UserNotYetRegistered = 1209,

        IndividualRequestSubmittedSuccessfully = 1210,
        ErrorsubmittingIndividualRequest = 1211,
        ControlledFunctionsIDList = 1212,

        UserAccountAlreadyExists = 1213,
        BirthDateLessThenCurrentDate = 1214,
        SelectApprovedIndividual = 1215,

        DoYouWantToDeactivateTheUser = 1216,
        UserNotYetRegisteredOnWebsite = 1217,
        IndividualDetailsDeletedSucessfully = 1218,
        HelpMessageFordeactivation = 1219,

        SEFcantDeactive = 1220,
        ReEnterEmailId = 1221,
        CaptchaWithoutSpace = 1222,

    }


    export enum IndividualRequestEmailDetails
    {
        UserRegistrationSubject = 1300,
        UserRegistrationTitle = 1301,
        QFCNo = 1302,
        EmailAddress = 1303,
        BirthDate = 1304,
        TemporaryPassword = 1305,

        UserRegistrationMainBody = 1306,
        UserRegistrationDisclaimer = 1307,
        SEF_UserRegistrationMainBody = 1308,
        Account_Request_UserRegistrationMainBody = 1309
    }

    export enum ForgetPasswordEmailDetails
    {
        ForgetPasswordSubject = 1400,
        ForgetPasswordTitle = 1401,
        ForgetPasswordBody = 1402,
        ForgetPasswordEmailFormat = 1403,
    }

    export enum ForgetPasswordPage
    {
        EnterValidEmailAddress = 1500,
        EnterEmailAddress = 1501,
        EmailAddressNotValid = 1502,

        ForgetPasswordPageLink = 1503,

        HelpText = 1504,
        SelectQuestion = 1505,
        IncorrectAnswer = 1506,
    }


    export enum ResetPasswordPage
    {
        YourAccountExpired = 1600,
        ErrorChangingPassword = 1601,
        EnterOldPassword = 1602,
        EnterCorrectOldPassword = 1603,
        ConfirmNewPasswordNotMatch = 1604,
        ProvideCorrectAnswer = 1605,
        EnterNewPassword = 1606,
        ReEnterNewPassword = 1607,
        OldAndNewPwdSame = 1608


    }

    export enum UserManagementServiceEmailDetails
    {
        UMSSubject = 1700,
        UMSTitle = 1701,
        UMSBody = 1702,
        UMSEmailAdminList = 1703,

        ErrorConditionSubject = 1704,
        ErrorConditionTitle = 1705,
        ErrorConditionBody = 1706,        
    }

    //Added By Nadim  on 21st Sept,2010
    export enum EmailApplicationStatus
    {
        ApplicationFailed = 1800,
        ApplicationRecieved = 1801

    }

    //Added By Tofik  on 22st Sept,2010
    export enum ConfirmationPageMessages
    {
        AccountCreated = 1900,
        PasswordChanged = 1901,
        LinkSent = 1902,
        Feedback=1903,
    }


    //Added By : Rashid Ali
    //Range    :16000-16100

    export enum FirmsContactDetailPage
    {
        RegIndividual = 16000,
        Country = 16001,
        MainEmailId = 16002,
        PreferredMethod = 16003,
        PositionOfMainContact = 16004,
        Telephone = 16005,
        Fax = 16006,
        EmailId = 16007,
        SaveMessage = 16008,
        PostionOfMainContactLength = 16009,
        TelephoneLength = 16010,
        FaxLegth = 16011,
        EmailIdLength = 16012,
        PurposeOfForm = 16013,

        ContactName = 16014,
        FirmDetail = 16016,
        MendatoryFielsMessage = 16017,

        ContactPersonIsWithdrawFromFirm = 16018,
        AI_ERRORR_MSG=16019
    }

    //Added By : Rashid Ali
    //Range    :17000-17100
    export enum Qualification
    {
        QulificationType = 17000,
        QulificationDescription = 17001,
        KeyTopicsCovered = 17002,
        Institution = 17003,
        QualFromMonth = 17004,
        QualToMonth = 17005,
        QualFromYear = 17006,
        QualToYear = 17007,
        ValidDate = 17008,
        SinceMonth = 17009,
        SinceYear = 17010,
        ValidSinceDate = 17011,
        MembershipType = 17012,
        MembershipDescription = 17013,
        MembershipDetails = 17014,
        QualificationSaveMessage = 17015,

        HigherEducationDetail = 17016,
        ProfessionalDevelopment = 17017,
        ProfessionalMembership = 17018,
        DescriptionOfQual = 17019,
        InstitutionOfQual = 17020,
        DatesOfQual = 17021,
        KeyTopicOfQual = 17022,
        DescOfMembership = 17023,
        OrgOfMembership = 17024,
        DatesOfMembership = 17025,
        DateSholdNotBeGreaterToday = 17026,
        HigherEducationSectionMsg = 17027,
        ProDevelopmentSectionMsg = 17028,
        ProMemebershipSectionMsg = 17029,

        HasEduQualQuestion = 17030,
        HasMoreEduQualQuestion = 17031,
        HasProMembershipQuestion = 17032,
        HasMoreProMembershipQuestion = 17033,

        ErrMsgToDateHighEdu = 17034,
        ErrMsgToDateProDev = 17035,
        ErrMsgToDateMembership = 17036,
                
        HasMoreHigherEduQuestion = 17037,
        OtherHigherEducationDetailsError =17038,
        OtherCertDetailsError = 17039,
        OtherMemDetailsError = 17040,
        HasHigherEducationQue = 536,
        HasMoreHigherEducationQue = 537,
    }


    //Added By : Rashid Ali

    //range    :18000-180010
    export enum FandP
    {
        FandPMessage = 18000,
        FandPSaveMessage = 18001,
        FandPDetail = 18002,
        AdditionalInfo = 18003,
        ChangesDescLength = 18004,
        AddInfoLength = 18005,
        FandPChangesDesc = 18006,
        FirmsAssessmentOfCompetencyDescription = 645,
        FirmsAssessmentExceedsTheLimit = 646
    }
    //Added By : Rashid Ali

    export enum FormType
    {
        FormQO3 = 1,
        FormQ11 = 2,
        FormQ11A =3,
        FormQ12 = 4,
        FormQ21 = 5,
        FormQ05 = 6,
        FormQ06 = 7,
        FormQ07 = 8,
        AINOC = 9,
        FormQ14 = 10,
        NoticeResponse=206,
    }
    //Added By : Rashid Ali
    export enum FormTypeAbb
    {
        Q03 = 1,
        Q11 = 2,
        Q11A = 3,
        Q12 = 4,
    }

    //Added By : Rashid Ali

    export enum QualifcationType
    {
        HigherEducation = 1,
        //ProfessionalEducation = 2,
        //Other = 3,
        OtherQualification=10
    }

    export enum CertificationCategoryType
    {
        ProfessionalCertification = 1,
        ProfessionalMembership = 2
    }

    export enum QuestionCategoryTypes
    {
        Level1 = 1,
        Level2 = 2,
        Level3 = 3,
    }

    export enum ConfirmationMessageTypes
    {
        AccountCreatedSuccessfully = 1,
        PasswordReset = 2,
        ForgetPassword = 3,
        FeedBackDataSave=4
    }

    export enum TermSubject
    {
        LoginSubject = 1,
        UserRegistrationSubject = 2,
        UserSignOffSubject = 3,
        UserSignOffSubjectDeclaration = 4
    }

    export enum ReportSchedule
    {
        FileUploadPath = 701,
        FileUploadedURI = 702,
        AttachFile = 703,
        UserName_Password_Req = 704,
        UserName_Password_Incorrect = 705,

        //Colors Notifiactions for differnet tasks type
        AcceptedColor = 706,
        PendingColor = 707,
        DueDatePassedColor = 708,
        HighlightColor = 709,
        NoRecords = 710,
        SignOffCompleted = 711,
        SignOffProcessFinished = 712,
        VirusFound = 713,
        FileUploadedToServer = 714,
        Select_File = 715,
        Select_Excel_File = 716,
        Excel_Read_Error = 717,
        Select_Proper_Report = 718,
        User_Not_Registered_Yet = 719,
        ReSubmit_Pending_Status_Desc = 720,
        Pending_Status_Desc = 721,
        Req_Signoff_NotPresent = 722,
        Signoff_AlreadyCompleted = 723,
        Report_Upload_Extensions_Allowed = 724,
        Select_Valid_File = 725,
        File_Download_Error = 726,
        Signatory_Info_Message = 727,
        Second_Signature_Pending = 728,
        Third_Signature_Pending = 729,
        Fourth_Signature_Pending = 730,
        FileSubmitted_SignOffStarted = 731,
        MessageBox_Header = 732,
        DocSignatories_NotPresent = 733,
        Special_Char_NotAllowed_InMOSS = 734,
        DocTypes_To_Validate = 735,
        Front_Sheet_Name = 781,
        Front_Sheet_Error_Message = 782,
        Excel_Sheet_Version_Error_Message = 783,
        Text_To_Find_In_Worksheet = 784,

        //Tanveer: 30 Jan 2012: Flag to check Q200 version, true = check and false = not check
        Flag_To_Check_Q200_Version = 789,

        //Tanveer: 1.0.3.3: Flag to check Q300 version, true = check and false = not check
        Flag_To_Check_Q300_Version = 790,

        //Enums for XML file node names for Report Schedule Details
        Email_Format_eSubmission = 750,
        Footer_ReportSchedule = 754,
        Login_Page = 755,
        From_Email = 756,


        //Type 1 - Removed as lot of emails were sent
        Title_Rpt_Submitted = 757,
        Sub_Rpt_Submitted = 758,
        Body_Rpt_Submitted = 759,

        //Type 2 - In Use
        Title_Rpt_Sign_Off_Required = 760,
        Sub_Rpt_Sign_Off_Required = 761,
        Body_Rpt_Sign_Off_Required = 762,

        //Type 3 - In Use
        Title_Rpt_Sign_Off_Acknowledge = 763,
        Sub_Rpt_Sign_Off_Acknowledge = 764,
        Body_Rpt_Sign_Off_Acknowledge = 765,

        //Type 4 - In Use
        Title_Rpt_Sign_Off_Completed = 766,
        Sub_Rpt_Sign_Off_Completed = 767,
        Body_Rpt_Sign_Off_Completed = 768,

        //Type 5 - Removed as lot of emails were sent
        Title_Rpt_ReSubmitted = 769,
        Sub_Rpt_ReSubmitted = 770,
        Body_Rpt_ReSubmitted = 771,

        //Type 6 - In Use
        Title_Rpt_Sign_Off_Required_GSO = 772,
        Sub_Rpt_Sign_Off_Required_GSO = 773,
        Body_Rpt_Sign_Off_Required_GSO = 774,

        //Type 7 - Send email for Sign Off Required Very First Time without Sign Off Completed By
        Title_Rpt_Sign_Off_Required_First = 775,
        Sub_Rpt_Sign_Off_Required_First = 776,
        Body_Rpt_Sign_Off_Required_First = 777,

        //Type 8 - Removed as Signed and Scanned feature is removed
        Title_Rpt_Sign_Off_Completed_SAS = 778,
        Sub_Rpt_Sign_Off_CompletedBy_SAS = 779,
        Body_Rpt_Sign_Off_CompletedBy_SAS = 780,

        //By IRIS
        XBRLSelect_Valid_PRIMARY_File = 1787,
        XBRLSelect_Valid_ATTACHMENT_File = 1788,
        XBRLSelect_INVALID_File = 1789,

        //ERROR Messages by IRIS
        XBRL_QFC_NUM=1790,
        XBRL_Category_ID=1792,
        XBRL_SCHEMAREF=1791,
       // XBRL_DOWNLOAD_LINK = 1793,
        XBRL_TAXONOMY_VERSIONID = 1794,
        XBRL_NATURE_OF_REPORT = 1795, 
        XBRL_FILE_DATA_MISMATCH = 1796,
        XBRL_EXCEL_DEC_MISSING = 1799,
        XML_DATEFORMAT= 1782,
        EXCEL_DATEFORMAT = 1781,
        INVALID_DATE = 1780, 
        RENDERHTMLMSG = 1802, 
        RENDERHTMLMSG1 = 1803,
        XBRL_TYPE_OF_REPORT = 1804,
        XBRL_SUBMISSION_TYPE = 1785,//BY IRIS Report Schedule (By Chandrashekhar)
        XBRL_REPORTING_FREQUENCY = 1805,//BY IRIS Report Schedule (By Chandrashekhar)
        XBRL_FIRM_FINANCIALYEAR_FROMDATE = 1806,//BY IRIS Report Schedule (By Chandrashekhar)
        XBRL_FIRM_FINANCIALYEAR_ENDDATE = 1807,//BY IRIS Report Schedule (By Chandrashekhar)
        XBRL_RPT_INS_FINANCIALYEAR_FROM = 1808,//BY IRIS Report Schedule (By Chandrashekhar)
        XBRL_RPT_INS_FINANCIALYEAR_TO = 1809,//BY IRIS Report Schedule (By Chandrashekhar)
        XBRL_GENSUB_RPT_FREQUENCY= 1810,
        XBRL_ENCRYPTED_FILE_VALIDATION = 1811,
        LICENCETYPE_VALIDATION=1812,
        INVALID_SHEETS = 1813,
        TAXONOMY_VERSION_CHECK=1814,
        INVALID_EFFECTIVE_DATE=1815,

        // BY IRIS Report Schedule (By Chandrashekhar)
        Sub_Rpt_Sign_Off_Completed_With_Warning=4006,
        Body_Rpt_Sign_Off_Completed_With_Warning=4012,
        Sub_Rpt_Completion_Sign_Off_Pending=4007,
        Body_Rpt_Completion_Sign_Off_Pending=4013,
        Completion_Sign_Off_Pending_Validation_Status=4001,
        Completion_Sign_Off_Pending_ActionRequested=4019,
        Sub_Rpt_Completion_Sign_Off_Completed=4008,
        Title_Rpt_Completion_Sign_Off_Completed=4002,
        Body_Rpt_Completion_Sign_Off_Completed=4014,
        Validation_Status_With_Warning = 4000,
        Validation_Status_Without_Warnings_ = 4001,
        Rpt_XBRL_Submission_Sign_Off_Action_Requested_With_Warnings=4019,
        Rpt_XBRL_Submission_Sign_Off_Action_Requested = 4020,

        INVALID_START_DATE=1783,
        INVALID_END_DATE=1784,
            //Added By IRIS -Sheetal
        
        Title_Rpt_Sign_Off_Completed_With_Warning=4000,
        Title_Rpt_Completion_Sign_Off_Pending=4001,
        FileSize= 1031,
        FileSizeMessage=1032,
        FileSizeConfigured = 1033,
        FileSizeErrorMessage = 1034,
    }

    //Added By Suhail on 14-Sep-2010
    export enum EmailType
    {
        Rpt_Submitted = 1, //Removed
        Rpt_Sign_Off_Required = 2,
        Rpt_Sign_Off_Acknowledge = 3,
        Rpt_Sign_Off_Completed = 4,
        Rpt_ReSubmitted = 5, //Removed
        Rpt_Sign_Off_Required_GSO = 6,
        Rpt_Sign_Off_Required_First = 7,
        Rpt_Sign_Off_Completed_SAS = 8, //Removed
        Sign_Off_Initiation = 9,
        Sign_Off_Completed = 10,

        // BY IRIS Report Schedule (By Chandrashekhar)
        Rpt_XBRL_Submission_Sign_Off_Completed_With_Warnings = 11,
        Rpt_XBRL_Submission_Sign_Off_Completed = 12,
        Rpt_XBRL_Completion_Sign_Off_Completed = 13
    }

    export enum SignOffMethodType
    {
        SignedAndScanned = 1,
        ElectronicSigned = 2,
        NoSignOff =3
    }

    export enum SignOffStatusType
    {
        Pending = 1,
        Submitted = 2,
        Cancelled = 3 // BY IRIS Report Schedule (By Chandrashekhar)
    }
    export enum IndividualDetailsValidation
    {
        Title = 110,
        FamilyName = 111,
        OthersName = 112,
        FamilyNamenot64Characters = 113,
        OtherNamenot128Characters = 114,
        DOBfromDropDown = 115,
        PassportNumbernot16Characters = 116,
        NationalIdentificationnot16Characters = 117,
        ResidentTPhonenot20Characters = 118,
        WorkTPhonenot20Characters = 119,
        EmailAddnot64Characters = 120,

        RAddressL1not126Characters = 121,
        RAddressL2not126Characters = 122,
        RAddressL3not126Characters = 123,
        RAddressL4not126Characters = 124,
        RACitynot56Characters = 125,
        RAStatenot56Characters = 126,
        RAZipnot16Characters = 127,

        QAddressL1not126Characters = 128,
        QAddressL2not126Characters = 129,
        QAddressL3not126Characters = 130,
        QAddressL4not126Characters = 131,
        QACitynot56Characters = 132,
        QAStatenot56Characters = 133,
        QAZipnot16Characters = 134,

        PNNamesnot192Charaters = 135,
        PNValidMonthYear = 136,

        PCCountry = 137,
        PCValidMonthYear = 138,
        PassportNAReason = 301,
        PrevAndCurrentAddrDateMsg = 302,
        StartAddrAndDOBDateMsg = 303,
        PrevAddrAndDOBDateMsg = 304,


        //Regex Validations: enums
        FamilyNamenotspecialcharacters = 139,
        OtherNamenotspecialcharacters = 140,
        PassportNumnotspecialcharacters = 141,
        NationalIDNumnotspecialcharacters = 142,
        ResidentialTelepNumnotspecialcharacters = 143,
        WorkTelepNumnotspecialcharacters = 144,

        RALine1notspecialcharacters = 145,
        RALine2notspecialcharacters = 146,
        RALine3notspecialcharacters = 147,
        RALine4notspecialcharacters = 148,
        RACitynotspecialcharacters = 149,
        RAStatenotspecialcharacters = 150,
        RAZipCodenotspecialcharacters = 151,
        ResidenciesFromDateGreaterTodate = 2017,

        QALine1notspecialcharacters = 152,
        QALine2notspecialcharacters = 153,
        QALine3notspecialcharacters = 154,
        QALine4notspecialcharacters = 155,
        QACitynotspecialcharacters = 156,
        QAStatenotspecialcharacters = 157,
        QAZipCodenotspecialcharacters = 158,
        RelocationdateforQatar = 2016,


        REQUIREDFIELD_VALDATION = 159,

        CountryOfBirth = 160,
        Nationality = 161,
        PassportNumber = 162,
        Jurisdiction = 163,
        PreviousNamesDetail = 164,
        ResidencyDetail = 165,
        NationalIDNumber = 166,
        ResidencePhone = 167,
        WorkPhone = 168,
        EmailAddress = 169,
        CurrentResidence = 170,
        AddressLines = 171,
        AddressCity = 172,
        AddressCountry = 173,
        PreviousName = 174,
        PreviousNameReason = 175,
        PreviousNameDate = 176,
        ResidencyType = 177,
        ResidencyCountry = 178,
        ResidencyFromDate = 179,
        ResidencyToDate = 180,
        ResidencyNote = 181,
        IndividualDetail = 182,
        PreviousNamesApplicable = 183,
        ResidencyApplicable = 184,
        NationalIDApplicable = 185,
        ThreeYearAddress = 186,
        SelectAI = 187,
        PreviousNameSpecialChar = 188,
        PrevNameReasonSpecialChar = 189,
        DateOfPrevNameGreaterToday = 190,
        DOBGreaterToday = 191,
        BirthPlaceSpecialChar = 192,
        CitizenshipNoteSpecialChar = 193,
        CitizenshipFromDateGreaterToday = 194,
        CitizenshipToDateGreaterToday = 195,
        CurrentResiFromDateGreaterToday = 196,
        PreviousResiFromDateGreaterToday = 197,



        PRLine1notspecialcharacters = 198,
        PRLine2notspecialcharacters = 199,
        PRLine3notspecialcharacters = 200,
        PRLine4notspecialcharacters = 2011,
        PRCitynotspecialcharacters = 2012,
        PRStatenotspecialcharacters = 2013,
        PRZipCodenotspecialcharacters = 2014,
        CompleteDOB = 2015,
        PleaseSelectFromDate = 2018,
        PleaseSelectProposedRelocationDate = 2019,
        ProposedToLiveInQatar = 2020,
        IndividualChange = 2021,
        EmailAlreadyExists = 2022,

        IndividualAlreadyExists = 2023,

        //Added by Nadim on 10 Dec,2010
        ErrMsgToDateResidencies = 2024,
        ErrMsgToDateMonthYear = 2025,
        ErrMsgToDateYear = 2026,
        ErrMsgToDateMonth = 2027,

        AINumberMissing = 2028,

        EnterTitle = 239
    }

    export enum IndividualDetailsDataExecution
    {
        IndividualDtlsSavedSuccessful = 1234,
        PersonalDtlsSavedSuccessful = 1235,
        SelectResidencyTypandCountry = 1236,
        PlzProvidePreName = 1237,
        Dateshouldnotgreaterthantodays = 1238,
        SelectAIbeforeMovetoNextTab = 1239,

        QuestionForPreviousNames = 9001,
        QuestionForAddnlPreviousNames = 9002,

        QuestionForResidencies = 9003,
        QuestionForAddnlResidencies = 9004,
    }

    export enum AddressType
    {
        AddressInQatar = 11,
        CurrentAddress = 5,
        AddressInPreviousYears = 7,
        //Added By Suhail on 30-Jun-2011
        LastPreviousAddressType = 9,
        RegulatorMailingAddress = 12
    }

    export enum ObjectOpType
    {
        Create = 40,
        Edit = 41,
        View=42,
    }

    export enum CareerHitoryType
    {
        CurrentEmployee = 1,
        PreviousEmployee = 2,
        GapsInEmployement = 3
    }

    export enum CareerHistoryMessage
    {
        SavedSuccessfully = 201,
        ErrorWhileSaving = 202,
        ValidFromAndToDateFor = 203,
        DateSholdNotBeGreaterToday = 204,
        ValidDateTo = 205,
        ValidDateFrom = 206,
        SevenYearCareerHistory = 207,
        OverlapCareerHistory = 208,
        SpecialCharacterNotAllowed = 209,
        OnlyNumberAndDashAllowed = 210,
        CurrentEmploymentError = 211,
        PreviousEmploymentError = 212,
        GapEmploymentError = 213,
        CareerHistoryDetail = 214,
        EmployerName = 215,
        PeriodOfEmployment = 216,
        EmployerTelephone = 217,
        EmployerBusines = 218,
        EmployerAddress = 219,
        ReasonForLeaving = 220,
        GapNote = 221,
        FaxOnlyNumberAndDashAllowed = 222,

        EmployerNameLength = 223,
        EmployerBusinessLength = 224,
        EmployerAddressLength = 225,
        TelNumLength = 226,
        RegulatoryStatusLength = 227,
        PositionHeldLength = 228,
        LeavingReasonLength = 229,
        GapNoteLength = 230,
        GapFoundMessage = 231,
        GapGraceDays = 232,

        PreviousEmpApplicableQuestion = 233,
        PreviousEmpAddQuestion = 234,
        PreviousEmpApplicableSelect = 235,
        CurrentAndPrevEmpDate = 236,
        ProvideEmployerRegStatus = 237,
        ProvidePositionHeld = 238,
        FirmsAssessmentExceedsTheLimitOfCharacters = 640,
        FirmsAssessmentOfCompetencyDescription = 638,
        RolesandResponsibilities=240,
        CareerHistoryCountry=241,


    }

    export enum ReglRegistration
    {
        PastPositionTextLength = 901,
        pastpositionTextType = 902,

        ddlcountry = 903,
        ddlRegulator = 904,
        Employer = 905,
        FunctionorPostion = 906,
        FromDay = 907,
        FromMonth = 908,
        FromYear = 909,
        ToDay = 910,
        ToMonth = 911,
        ToYear = 912,
        FromDateGreaterToDate = 913,
        EmptyFeilds = 914,
        PastPositonDesc = 915,
        OverseasReglDtlsSavedSuccessful = 916,

        FunctionorPositionTextType = 917,
        EmployerTextType = 918,

        //salim
        OverseasReglDetail = 919,
        Regulator = 920,
        EmployerName = 921,
        FunctionOrPosition = 922,
        PeriodOfAuthorisation = 923,

        SelectCountryRegulatorDDL = 924,

        //aslamn
        FromdateGreaterThanToday = 925,
        TodateGreaterThanToday = 926,

        QuestionForRegulatory = 9005,
        QuestionForAddnlRegulatory = 9006,

        //Added by nadim on 10 Dec,2010
        ErrMsgToDateReg = 9007,
        QuestionForPastPosition = 9008,

        PositionHeld = 642,
        NameOfEntity= 643,
        CountryOfIncorporation = 644,
        MailingAddress=655,
        Address1=658,
        AddressCity=656,
        AddressState=657,

    }


    export enum ResetPasswordCriteriaFlag
    {
        ForgetPassword = 1,
        ResetPassword = 2,
        ChangePassword = 3
    }

    export enum WObjects
    {
        MainMenu = 0,
        ReportSchedule = 1,
        IndividualApplications = 2,
        Administration = 3,
        AIReport = 4,
        Home = 5,
        Login =6,
        ExtNotification = 7,
        UserManagement = 8,
        ForgotPassword = 9,
        Feedback = 10,
        UserProfile = 11,
        ExceptionNotification = 12,
        UserRegistration = 13,
        NotificationOfCompetency = 14,
        GeneralSubmission = 15,
        FirmNotice=17,
        FirmNoticeResponse=18
    }

    export enum FirmsObject
    {
        GeneralSubmission = 100,
        AIDOCS =701,
            NOTICE=800,
            NoticeResponse =801,
    }

    export enum WObjectEventType
    {
        Post = 1,
        UpdateAllowResubmit = 2,
        UpdateSignOff = 3,
        UpdateDocReSubmissionInProgress = 4,
        ValidationPost = 5,//IRIS
        ValidationResult = 6,//IRIS
        PostGeneralSubmission = 7,//IRIS
        SubmissionPost=8,// By IRIS Report schedule
        CompletionPost = 9// By IRIS Report schedule
    }

    export enum WObjectPages
    {
        AIReport = 0,
        Declaration = 6,
        /* Added By nadim on 9th Nov,2010*/
        FirmDetails = 7,
        IndividualDetails = 8,
        ControlledFunctions = 9,
        CareerHistory = 10,
        Registrations = 11,
        Qualifications = 12,
        Fitness = 13,
        Attachments = 14,
        Login_Notice=15,
        UserRegistration = 16,
        ConditionalApproval = 17,
        AdditionalCF = 18,
        Skills = 19,	
        WithdrawalCF = 20	
    }
    export enum WPageSections
    {
        StartUpDesc = 0,
        QFCRAOffAddress = 1,
        Background = 2,
        GuidanceToCompleteForm = 3,
        DefinedtermsOfForm = 4,
        WhoMustMakeApplication = 5,
        ReqToCompleteform = 6,
        ReqSignByInd = 7,
        ReqSignByAppfirm = 8,
        ReqSignByAutfirm = 9,
        SubmittingForm = 10,
        HowInfoOfFormUsed = 11,
        DeclarationsAndConsent = 37,
        Notice =87,
        UserRegistrationNoticeSection = 88,
        GetSignatureFromApplicantMessageForQ03 = 89,
        GetSignatureFromApplicantMessageForQ12 = 90,
        FamilyNameHelpText = 91,
        PassportNumberAndJurisdictionOfIssue = 92,
        PleaseAttachToThisApplication = 93,
        ForCFFApplication = 94,
        ConditionalApprovalCFF = 95,
        ForWhichCompetencyRequirement = 96,
        PleaseProvideActionPlan = 97,
        PleaseProvideNameAINumber = 98,
        SkillsOfIndividual = 99,
        PleaseListTheSkills = 100,
        SkillsFirmsAssessmentOfCompetency = 101,
        KnowledgeOfIndividual = 102,
        KnowledgeFirmsAssessmentOfCompetency = 103,
        ExperienceFirmsAssessmentOfCompetency = 104,
        ExpFirmsAssessmentOfCompetencyQue = 105,
        FitnessFirmAssessmentOfFitnessPropriety = 106,
        FitnessProprietyOfIndividual = 107,
        ExpQ11FirmsAssessmentOfCompetency = 108,
        IndividualProposeToLiveInQatar = 112,
        SignatureMessageForApplicant = 113,

        NameAndPosition  = 39,
        FamilyName = 45,
        ProfessionalMemberships = 83,
        CurrentOrMostRecentPosition = 76,
        RegulatoryRegistrations = 79,
        NatureOfArrangementQuestion = 114,
        HowTheControlledFunctionExercisedQuestion = 115,
        GetSignatureFromApplicantMessageForQ11 = 116,
    }

    export enum ObjTaskSyncStatusType
    {
        NotSynchronized = 0,
        Synchronized = 1,
    }

    export enum ControlTypes
    {
        LinkButton = 0,
        MenuControl = 1,
        ImageButton = 2,
        Panel = 3,
        Button = 4,
        HtmlButton = 5,
        GridView = 6
    }

    export enum MasterTable
    {
        AppIndividualArrangementTypes,
        AIWithdrawalReasonTypes,
        CareerHistoryTypes,
        v_ControlledFunctionTypes,
        ResidencyTypes,
        v_AIActivityTypes,
        ProductTypes,
        V_AIStatusChangeReasonTypes,
    }

    export enum ControlledFunctionMessage
    {
        SavedSuccessfully = 251,
        ErrorWhileSaving = 252,
        SelectIsJobTitleChange = 253,
        SelectAltArrangement = 254,
        ProvideOtherDesc = 255,
        ProvideProposedJobTitle = 256,
        ProvideAltArrangementDesc = 257,
        ProductNotAuthorised = 258,
        ActivityNotAuthorised = 259,
        CommencementDate = 260,
        EffectiveDate = 261,
        ActivityProductSelect = 262,
        ControlledFunctionSelect = 263,
        ArrangementTypeSelect = 264,
        ArrangementTypeOtherDesc = 265,
        CFExercisedDesc = 266,
        ApplicationDetail = 267,
        jobDescription = 268,
        WithdrawalReasons = 269,
        WithdrawalOtherreason = 270,
        FunctionNotAuthorised = 271,
        NatureOfArrOtherLength = 272,
        CFExerciseMannerLength = 273,
        ProposedJobTitleLength = 274,
        jobDescLength = 275,
        ApplicationDetailLength = 276,
        CFExerciseDesc = 277,
        ReasonForWithdrawalLength = 278,
        FurtherInfoLength = 279,
        AltArrangementDescLength = 280,
        DateShouldNotLessThanToday = 281,
        ValidDate = 282,
        PleaseSelectOneProduct = 283,
        WithrawalReason = 284,
        CompetencyAndExperienceDetail = 285,

        PleaseProvideWithdrawalDate = 286,
        ValidWithdrawalDate = 287,

        AnswerToTheQuestion =  629,
        PleaseSelectWithdrawalReason = 630,
        WithdrawalReasonOtherDescription = 631,
        AdditionalInformation = 632,
        ReplacementSupervisor = 633,
        AlternateArrangementDescription = 634,
        ReasonForWithdrawalExceedsTheLimitOfCharacters = 641,
        DelayInFiling = 803,
        ExemptedDays = 542

    }


    export enum DocTypes
    {
        FormQ03 = 3,        //Form Q03-Application for approval of individuals
        FormQ11 = 5,        //Form Q11-Application to Modify Approved Individual Status or Notify the Regulatory Authority of Change
        FormQ12 = 6,        //Form Q12-Application to Withdraw Approved Individual Status
        FormQ100 = 10,      //Form Q100-Prudential Returns for Authorised Firms conducting Investment and Banking Business
        FormQ200 = 11,      //Form Q200 - Prudential Returns for Authorised Firms Effecting or Carrying Out Contracts of Insurance
        FormQ300 = 12,      //Form Q300 - Prudential Returns for Authorised Firms conducting Insurance Mediation Business.
        FormQ400 = 29,      //Form Q400 – Prudential Returns for Authorised Firms Effecting or Carrying out Contracts of Insurance as a Takaful Entity
        FormQ21 = 39,       //Form Q21-Approved individual application relating to an applicant firm
        NOC = 43,           //Notification of Competency for a Conditionally Approved Individual
        FormQ05 = 17,       // Form Q05 - Waiver Application
        FormQ06 = 18,       //Form Q06-Controller
        FormQ07 = 19,       //Form Q07-Notifications
        FormQ11A = 42,      //QFC Form 11A - Notification of changes in personal details of an approved individual
        FormQ14 = 23,         //Form Q14-General Submission
        AttachmentstoaNotice=205,

    }

    export enum FunctionTypes
    {
        SeniorExecutive = 1,
        ExecutiveGovernanceFunction= 2,
        NonExecutiveGovernanceFunction= 3,
        ComplianceOversightFunction= 4,
        RiskManagementFunction= 5,
        FinanceFunction= 6,
        MLROFunction= 7,
        SeniorManagementFunction= 8,
        ActuarialFunction= 9,
        CustomerFacingFunction= 10,
        IndividualController= 11,
        Director= 12,
        Secretary= 13,
        PrincipalRepresentative= 14,
        DirectorMemberOfNonQFC= 15,
        MembersForLLP= 16,
        AIApplicant = 20,
        DNFBPSEF=18
    }

    export enum FunctionStatusType
    {
        Apply = 1,
        AppliedForWithdrawn = 2,
        Approved = 3,
        Withdrawn = 4,
        ApplicationWithdrawn = 5,
        WithdrawnFunction = 6,
        WithdrawnInvoluntary = 7,
        ConditionallyApproved = 8,
        NOCApplied = 9,
        ConditionalApprovalCeased = 10,
        AppliedApprovalStatusChange = 11,
        AppliedWithdrawnStatusChange = 12,
        WithdrawnTerminationByFirm = 13,
        WithdrawnInactive = 14,
        APPROVED_INACTIVE=17,
        APPROVED_FIRM_INLIQUIDATION = 19,
    }



    export enum DocSubTypes
    {
        CertifiedIndividualPassportPages = 61,
        IndividualJobDescForProposedControlledFunctions = 62,
        FirmsCompetenceAssessmentforQ03 = 63,
        CertificateOfEvidenceforQ03 = 201,
        Otherdocuments = 66,
        Q03_OtherDocument=66,
        Q11_OtherDocument = 254,
        Q12_OtherDocument = 236,

        CertificateOfEvidenceforQ11 = 71,
        FirmsCompetenceAssessmentforQ11 = 63,
        FirmsCompetenceAssessmentAddendum = 238,

        QFCFormQ03 = 237,
        QFCFormQ11 = 69,
        QFCFormQ12 = 72,

        Q11Otherdocuments = 254,
        AMLSystemsControlsAppendixToFormQ03Q11 = 163,
    }


    export enum ApplicationStatus
    {
        ApplicationReceived = 1,
        RSGAssessment = 2,
        COAssessment = 3,
        AIForumReview = 4,
        CEOReview = 5,
        ApplicationCompleted = 6,
        ApplicationWithdrawn = 7,
        ApplicationOnHold = 8,
        DeptCEOReview = 9
    }
    export enum Attachments
    {
        AttachmentsUploadedSuccessfully = 612,
        fileUploadPath = 701,
        OtherDocDesc = 614,
        NoMendatoryDocAttached = 615,
        CheckDocType = 616,
        SelectDocument = 617,
        ErrwhileSaving = 12345,
        NoMoreFileToAttach = 618,
        AllMandatoryFilesAttach = 619,

        HelpTextSelectFile = 620,
        HelpTextCheckOff = 621,
        HelpTextAttach = 622,

        BrowseFileClickOk = 623,
        SpecifyIsAnyAdditionalFile = 624,

        MaxAttachmentForQ03 = 6,
        MaxAttachmentForQ11 = 3,
        MaxAttachmentForQ12 = 1,

        SpecialCharFor = 625,
        AttachmentListModified = 626,

        UseQFCFormQ03Addendum = 785,

        //Tanveer: 30 Jan 2012: Additional text for the Q03/Q11 Addendum
        AdditionalTextFormQ03Addendum = 788,
        ReasonForNoAttachments = 647,

        Q03OtherDocDesc= 650,
        Q11OtherDocDesc = 651,
        Q12OtherDocDesc = 652,

        PleaseSaveInformationBeforeAttaching = 693,
        PleaseSelectDocumentType = 694,
        PleaseEnterOtherDocDesc = 802,
        FormReportNameText= 529,
        SelectAndUploadBeforeAddingMore = 535,
        AMLSystemsAndControlsText = 541,
    }

    export enum ActionType
    {
        Add = 1,
        Withdraw = 2,
        Modify = 3
    }

    export enum AppIndividualActionTypes
    {
        Apply = 1,
        AppliedForWithdrawn = 2,
        Approved = 3,
        Withdrawn = 4,
        ApplicationWithdrawn = 5
    }

    //Added By Suhail on 24 Aug 2010
    export enum UploadTo
    {
        MOSS = 1,
        Server = 2
    }

    //Added by Taufik on 29 Aug 2010
    export enum RequestAccessTypes
    {
        Grant = 1,
        Revoke = 2
    }

    //Added by Taufik on 06 Sep 2010
    export enum AccountTypes
    {
        Permanent = 1,
        AIApplicant = 2
    }


    //Added by Salim on 30-Aug-2010
    export enum AIForms
    {
        FirmDetails = 1,
        IndividualDetails = 2,
        ControlledFunctions = 3,
        CareerHistory = 4,
        OverseasRegulators = 5,
        Qualifications = 6,
        Fitness = 7,
        Attachments = 8,
        Declarations = 9,
        ConditionalApproval = 10,
        AdditionalCF = 11,
        Skills = 12,
        WithdrawalCF = 13,
        CareerHistoryQ11 = 14
    }

    //Added By Nadim on 7th Sept,2010
    export enum ApplicationStatusTypes
    {
        Pending = 2001,
        Finalised = 2002,
        ReSubmissionRequired = 2003

    }
    //Added By Saalim on 11 Nov,2010
    export enum AppStatus
    {
        Pending = 1,
        Finalised = 2,
        ResubmissionRequired = 3,
        Accepted = 4,
    }

    export enum DeclarationMessage
    {
        PrefixDataValidation = 7000,
        PostfixDataValidation = 7001,
        NotApplicableConfirmation = 7002,
        NoSelectConfirmation = 7003,
        NameOfFirmPlaceHolder = 7004,
        QFCNoPlaceHolder = 7005,
        TheEachPlaceHolder = 7006,
        SignOffSuccessfull = 7007,
        SignOffStartedSuccessfull = 7008,

        MissingEmailForSignOff = 7009,
        MissingDateOfBirthForSignOff = 7010,
        MissingEmailAndDateOfBirthForSignOff = 7011,
        ViewApplicationBeforeSignoff = 7012,

        NoSignatoryFound = 7013,
        SomeSignatoryNotFound = 7014,
        SameSignatoryFound = 7015,
        MultipleSignatoriesInfoText = 7016,

        SpecificRoleForSignature = 7017,

        EnterReasonForAppReturn = 7018,
        SignOffCanceledSuccessfull = 7019,
      
        SpecificRoleUserExists = 7020,
        ViewOrReturnAppBeforeSignoff = 7021,
        ReturnHelpText = 7022,
         //Tanveer : added the below to solved the issue of incorrect
        //message when user clicked on request changes to applicant.
        SignOffCanceledSuccessfully = 627,
        UserAlreadyExistsWithTheSameEmailID = 628,
        DeclarationHeadingQ03 = 538,
        DeclarationHeadingQ11 = 539,
        DeclarationHeadingQ12 = 540,
        ReassignSignoffTaskSelectDifferentUserMessage = 546,
        SignoffWFStartPleaseSelectUserMessage = 547,
        TaskAlreadyCompletedMessage = 548,
        SignatoriesChangedMessage = 549,
        SameUserMessage = 550,
        SelectUserFirstPositionMessage = 551,
        SelectUserSecondPositionMessage = 552,
        Q11SelectUserFirstPositionMessage = 553,
        Q11SelectUserSecondPositionMessage = 554,
        Q12SelectUserFirstPositionMessage = 555,
        Q12SelectUserSecondPositionMessage = 556,
        Q11Q12SignatureMessageForApplicant = 557,

        InformationSubmittedSuccessfully = 1797,
    }

    export enum AppCompleteEmailDetails
    {
        AppSignOffRequireSubject = 511,
        AppSignOffEmailTitle = 512,
        AppSignOffEmailBody = 513,
        PageURL = 514,
        FirmName = 515,
        ContactPerson = 516,
        FunctionText = 517,
        AppliedFunctionText = 518,
        WithdrawnFunctionText = 519,
        AppliedDateText = 520,
        SignOffCompleteText = 521,
        SignOffRequireText = 522,
        AppSignOffCompleteSubject = 523,
        ApplicantName = 524,

        CancelWFTitle = 525,
        CancelWFReason = 526,
        CancelledBy = 527,
        EmailBodyHeaderForWFCancel = 528,
        ProductsBeingAdded = 786,
        ProductsBeingWithdrawn = 787
    }

    export enum Signatories
    {
        FirstSignatory = 1,
        SecondSignatory = 2,
        ThirdSignatory = 3,
        FourthSignatory = 4,
    }

    export enum PendingItemsOnHomePage
    { 
        ReportDesc = 2100,
        AIDesc = 2101,
        ReportDueAndSignOffPending = 2102,
        ReportOverDueAndSignOffPending = 2103,
        ReportDueAndNotSubmitted = 2104,
        ReportOverDueAndNotSubmitted = 2105,
        ApplicationNotSubmitted = 2106,
        ApplicationSignOffPending = 2107,
        ApplicationResubmission = 2108,
        ReportResubmission = 2109,
        
        ApplicationSubmitted = 2110,
        ApplicationAccepted = 2111,
        //salim on 24-jan-2011
        PendingItemClickMsg = 2112,
        UserPendingItemClickMsg = 2113,
        ApplicationDeleted = 2114,
        AttachmentResubmission = 2115,
        NocNotSubmitted = 684,
        NocSignOffPending = 685,
        GenSubNotSubmitted = 695,
        GenSubSignOffPending = 696,

        SubmittedGenSubOnHomePage = 799,
        SubmittedNOCOnHomePage = 800,
    }

    export enum SaveChangesPrompt
    { 
        NoPrompt = -1,
        NotModified = 0,
        Modified = 1
    }

    export enum AccesRequestType
    {
        ApprovedIndividual = 1,
        RequiredIndividual = 2,
        DocumentAdmin = 19
    }

    export enum ApphistoryMsg
    {
        NoCompletedAppMsg = 13001,
        NoPendingAppMsg = 13002,
        PendingItemClickMsg = 13003,
        CompletedItemClickMsg = 13004,
    }

    //Added by Abrar on 25 Jan 2011

    export enum ObjectTypeTable
    {
        v_WFeedbackTypes,
        V_ESSActiveFirms
    
    }

    export enum ContactUsMsg 
    { 
        emailbody=15000,    
        emailSubject=15002,
        emailAddressITAdmin=15003,
        emailTItle = 15004,
        feedBackUserName=15005,
        feedbackQfcNumber=15006,
        feedBackEmailAddress=15007,
        feedbackDescription =15008,
        feedBackSave=15009,
        feedBackErrorMsg=15010,
        feedBackHeaderMessage=15011,
        feedBackDescriptionMessage =15012,
        emailFormat =15013,
        CaseOfficerSupervision = 15014,
        CaseOfficerAuthorisation = 15015,
    }

    export enum WObjectTextID
    { 
        Login_Notect =52,
    }

    export enum PasswordSecurity
    {
        TotalDays  = 4500,
        PromptDayStart  = 4501,
        HelpInfo = 4502,
        DaysLeftText = 4503,   
        PasswordExpired = 4504
    }

    export enum MessagePopupType
    { 
        Validation = 1,
        Successfull = 2

    }
    export enum LateReportingMsg
    { 
        ONEDAY_TITLE=21000,
        ONEDAY_SUBJECT=21001,
        ONEDAY_BODY = 21002,
        AUTHORISED_LATEREPORTING_EMAILTO=21003,
        DNFBP_LATEREPORTING_EMAILTO = 21016,
        LATEREPORTING_NOOFDAYS=21004,
        LATEREPORTING_BUSSINESSDAYS = 21005,
        GRACEPERIOD_EMAILBODY=21006,
        RESUBMISSION_EMAILSUBJECT=21007,
        GRACEPERIOD_EMAILTITLE=21008,
        ACKNOWLEDGEMENT_NOTE = 21009,
        NO_SUBMISSION_RECEIVED_SUBJECT = 21010,// By IRIS Report Schedule
        FIVEDAY_BODY = 21011,// By IRIS Report Schedule
        STATUSNOTVALIDFORLATEREPORTING=4023
    }


    export enum CAMessages
    {
        CompetencyRequirement = 635,
        ActionPlan = 636,
        PleaseSelectSupervisor = 637,
        SavedSuccessfully = 648,
        NoSupervisorMessage = 653,
        NoSupervisorMessageQ11 = 654,
        NoSupervisorMessageQ12 = 659
    }

    export enum SkillsMessages
    {
        FirmsAssessmentOfCompetencyDescription = 638,
        PleaseEnterDescription = 639,
        SavedSuccessfully = 649
    }

    export enum NocMessages
    { 
        SavedSuccessfully = 686,
        AcquiredCompetencies = 687,
        SelectCA = 688,
        SelectAnswer = 689,
        ConditionSatisfied = 690,
        SelectConditionSatisfied = 691,
        LengthCharacter = 692,
        NoCAMessage = 801
    }

    //Added By Saalim on 11 Nov,2010
    export enum AttachmentStatus
    {
        Pending = 1,
        Finalised = 2,
        ResubmissionRequired = 3,
        Accepted = 4,
    }

    export enum UserRole
    {
        SeniorExecutive =1,
        ExecutiveGovernance = 2,
        NonExecutiveGovernance = 3,
        ComplianceOversight = 4,
        RiskManagement = 5,
        Finance = 6,
        MoneyLaunderingReporting = 7,
        SeniorManagement = 8,
        Actuarial = 9,
        CustomerFacing = 10,
        IndividualController = 11,
        Director = 12,
        Secretary = 13,
        PrincipalRepresentative = 14,
        DirectorORMemberOfNonQFC = 14,
        MembersForLLP = 16,
        MLRO = 17,
        SEF = 18,
        DocumentAdmin = 19,
        AIApplicant = 20
    }

    export enum CompetencyType
    {
        Skill = 1,
        Knowledge = 2,
        Experience = 3,
    }

    export enum InsuranceMediation
    {
        a = 402,
        b = 403,
        c = 404,
        d = 405
    }

    export enum ObjectStatus
    {
        Pending = 1,
        Finalised = 2,
        ResubmissionRequested = 3,
        Accepted = 4
    }

    export enum NOCEmail
    {
        Initiation_SignOff_Title = 678,
        Initiation_SignOff_Subject = 679,
        Initiation_SignOff_Body = 680,

        Completed_SignOff_Title = 681,
        Completed_SignOff_Subject = 682,
        Completed_SignOff_Body = 683,

        NocAlertEmailTitle = 804,
        NocAlertEmailSubject = 805,
        NocAlertEmailBody = 806
    }

    export enum GenSubEmail
    {
        SignOff_Title = 791,

        Initiation_SignOff_Subject = 792,
        Initiation_SignOff_Body = 793,

        Completed_SignOff_Subject = 794,
        Completed_SignOff_Body = 795,

        
        //By IRIS
        XbrlCompleted_SignOff_Body = 7951,

        AIApplication_EmailTitle = 292,
        AIApplication_EmailBody = 293
    }

    export enum GenSubMessage
    {
        InformationSavedSuccessfully = 796,
        PleaseAttachFormTypeDesc = 797,
        PleaseAttachFormTypeDescForAdditionalDoc = 798,
        Q05FormLinkDesc = 530,
        Q06FormLinkDesc = 531,
        Q07FormLinkDesc = 532,
        Q11AFormLinkDesc = 533,
        Q14FormLinkDesc = 534,
        PleaseAttachPrimaryDoc = 1798
    }

    export enum WRoles
    { 
        SeniorExecutive= 1,
        ExecutiveGovernance= 2,
        NonExecutiveGovernance= 3,
        ComplianceOversight= 4,
        RiskManagement= 5,
        Finance= 6,
        MoneyLaunderingReporting= 7,
        SeniorManagement= 8,
        Actuarial= 9,
        CustomerFacing= 10,
        IndividualController= 11,
        Director= 12,
        Secretary= 13,
        PrincipalRepresentative= 14,
        DirectorMemberOfNonQFC= 15,
        MembersForLLP= 16,
        DocumentAdmin= 19,
        AIApplicantRole= 20,
    }

    export enum GenericEmailMessages
    {
       GenericEmailFormat = 900
    }

    export enum ControlRuleCheckMessages
    {
        ApprovedInMultipleFirmsAlertMessage = 543,
        MultipleFunctionAppliedAlertMessage = 544,
        ResidencyRequirementsAlertMessage = 545
    }

    export enum Announcement
    {
        AuthorisedHomePageAnnouncementMessage = 558,
        DNFBPHomePageAnnouncementMessage = 21017
       
    }

    export enum ValidationKey
    {
        ReportStartDate=1,
        ReportEndDate = 2, CurrentFinancialStartDate = 3, CurrentFinancialEndDate = 4, TypeofReportId = 5
    }

    //By Iris

    export enum FilingStatus
    {
        NotGenerated = 1,
        Error = 2,
        Generated = 3
    }
   
   

    export enum EmailText  // By IRIS Report Schedule
    {
        ValidationStatus1 = 4000,
        ValidationStatus2 = 4001,
        ValidationStatus3 = 4002,
        Event0Subject = 4003,
        Event11Subject = 4004,
        Event12Subject = 4005,
        Event21Subject = 4006,
        Event22Subject = 4007,
        Event3Subject = 4008,
        Event0Boby = 4009,
        Event11Body = 4010,
        Event12Body = 4011,
        Event21Body = 4012,
        Event22Body = 4013,
        Event3Body = 4014,
        Event12Action1 = 4017,
        Event12Action2 = 4018,
        Event22Action1 = 4019,
        Event22Action2 = 4020,
        ValidationStatus4 =4025,
    }


    export enum DueDateType  //By IRIS Report Schedule
    {
        DueDate = 1,
        AfterDueDate = 2,
        FiveDayBeforeDueDate = 3
    }


    // BY IRIS Report Schedule (By Chandrashekhar)
    export enum SubmissionType
    {
        Regular = 1,
        Additional = 2
    }

    // BY IRIS Report Schedule (By Chandrashekhar)
    export enum AttachmentStatusType
    {
        Pending = 1,
        Finalised = 2,
        ResubmissionRequired = 3,
        Submitted = 4,
        GenSubNonXBRLPending = 5,
        GenSubNonXBRlFinalised = 6,
        GenSubNonXBRLFileInvalidated = 7,
        GenSubNobXBRLSubmitted = 8,
        GenSubXBRlFileUploaded = 9,
        GenSubXBRlFinalised = 10,
        GenSubXBRlFileInvalidated = 11,
        GenSubXBRlSubmitted = 12,
        RptXBRLFileUploadedandValidationPending = 13,
        RptXBRLValidationInProgress = 14,
        RptXBRLValidationFailed = 15,
        RptXBRLValidationPassed = 16,
        RptXBRLValidationPassedwithwarnings = 17,
        RptXBRLSubmissionSignOffPending = 18,
        RptXBRLSubmissionSignOffPendingwithwarnings = 19,
        RptXBRLSubmissionSignOffCompleted = 20,
        RptXBRLSubmissionSignOffCompletedwithwarnings = 21,
        RptXBRLExplanationforWarningsPending = 22,
        RptXBRLCompletionSignOffPending = 23,
        RptXBRLCompletionSignOffCompleted = 24,
        RptXBRLResubmissionRequested = 25,
        RptXBRLFileInvalidated = 26,
        RptXBRLSubmitted = 27,
        RptNonXBRLFileUploaded = 28,
        RptNonXBRLSignOffPending = 29,
        RptNonXBRLSignOffCompleted = 30,
        RptNonXBRLResubmissionRequested = 31,
        RptNonXBRLFileInvalidated = 32,
        RptNonXBRLSubmitted = 33,
        ApplicationPending = 34,
        ApplicationFinalised = 35,
        ApplicationResubmissionRequired = 36,
        ApplicationSubmitted = 37,
        NoticeAttachmentsFinalized=38,
        NoticePending = 39,
        NoticeFinalised = 40,
        NoticeAccepted = 41,
        



    }

    // BY IRIS Report Schedule (By Chandrashekhar)
    export enum roles
    {
        FINANCEFUNCTION = 6,
        RISKMANAGEMENTFUNCTION = 5,
        COMPLIANCEOVERSIGHTFUNCTION = 4,
        SENIOREXECUTIVEFUNCTION = 1,
        EXECUTIVEGOVERNANCEFUNCTION = 2,
        MLROFUNCTION = 7
    }
    export enum ValidationWarningsMessages
    {
        ExplanationUpdatedSuccessfully = 4021,
        ExplanationFieldEmpty = 4022,
        AtleastOneExplanation = 4024

    }

    export enum FirmType
    {
        Authorized = 1,
        DNFBP = 2,
        Licensed = 3,
        ToBeDetermined = 4

    }

    export enum WResponseTypes
    {
        Yes_No_NotApplicable = 1,
        Date = 2,
        Number = 3,
        List_of_values_Single_Response = 4,
        List_of_values_Multiple_Response = 5,
        Explanation = 6,
    }

    export enum WEvaluationRequirementType
    {
        Yes =1,
        No=2,
        Conditional =3,
    }
    export enum ErrorType
    {
        Error = 1,
        Warning = 2,
        Information = 3,
        Success = 4,
    }
