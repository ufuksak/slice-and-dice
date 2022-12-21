/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/auth/login": {
    post: operations["postSaveRepo"];
  };
  "/auth/logout": {
    post: operations["postLogout"];
  };
  "/auth/update": {
    put: operations["updateUser"];
  };
  "/auth/statistics": {
    get: operations["getSalaries"];
  };
  "/auth/users": {
    get: operations["getUsers"];
  };
  "/auth/register": {
    post: operations["postSaveRepo"];
    delete: operations["deleteUserByName"];
  };
  "/auth/forgotPassword": {
    post: operations["postSaveRepo"];
  };
  "/auth/vehicle": {
    get: operations["getVehicles"];
    post: operations["postSaveVehicle"];
  };
  "/auth/ping": {
    get: {
      responses: {
        /** Successfully. */
        200: {
          content: {
            "application/json": components["schemas"]["response"];
          };
        };
        400: components["responses"]["BadRequest"];
        404: components["responses"]["NotFound"];
        "5XX": components["responses"]["InternalError"];
      };
    };
  };
  "/auth/time": {
    get: {
      responses: {
        /** Successfully. */
        200: {
          content: {
            "application/json": components["schemas"]["ServerTime"];
          };
        };
        400: components["responses"]["BadRequest"];
        404: components["responses"]["NotFound"];
        "5XX": components["responses"]["InternalError"];
      };
    };
  };
  "/auth/transactionList": {
    post: operations["TransactionList"];
  };
  "/auth/reservationList": {
    post: operations["ReservationList"];
  };
  "/auth/cancelReservation": {
    post: operations["CancelReservation"];
  };
  "/auth/changeAvailability": {
    post: operations["ChangeAvailability"];
  };
  "/auth/remoteStartTransaction": {
    post: operations["RemoteStartTransaction"];
  };
  "/auth/remoteStopTransaction": {
    post: operations["RemoteStopTransaction"];
  };
  "/auth/startTransaction": {
    post: operations["StartTransaction"];
  };
  "/auth/stopTransaction": {
    post: operations["StopTransaction"];
  };
  "/auth/setChargingProfile": {
    post: operations["SetChargingProfile"];
  };
  "/auth/setRate": {
    post: operations["SetRateObject"];
  };
  "/auth/setConnector": {
    post: operations["SetConnector"];
  };
  "/auth/chargeStation": {
    get: operations["ChargePointList"];
    post: operations["SetChargeStation"];
  };
}

export interface components {
  schemas: {
    VehicleList: components["schemas"]["Vehicle"][];
    Vehicle: {
      brand?: string;
      model?: string;
      year?: string;
      pictureLink?: string;
      postCode?: string;
    };
    UserEmail: {
      /** Format: email */
      name?: string;
    };
    UserResponse: {
      accessToken?: string;
      refreshToken?: string;
    };
    UserList: components["schemas"]["UserEntity"][];
    UserEntity: {
      name?: string;
      displayName?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      bio?: string | null;
      avatar?: string | null;
      phone?: string | null;
      country?: string | null;
      password?: string | null;
      salary?: string | null;
      currency?: string | null;
      department?: string | null;
      on_contract?: string | null;
      sub_department?: string | null;
      addresses?: components["schemas"]["AddressItem"][];
      privileges?: components["schemas"]["PrivilegeItem"][];
    };
    AddressItem: {
      line1?: string;
      city?: string;
    };
    PrivilegeItem: {
      entity?: string;
      read?: boolean;
      create?: boolean;
      update?: boolean;
      delete?: boolean;
      admin?: boolean;
    };
    UserToken: {
      refreshToken?: string;
    };
    SalaryResponse: {
      department_name?: string;
      averageSalary?: number;
      minSalary?: number;
      maxSalary?: number;
    };
    ChargingSchedule: {
      /**
       * Format: int32
       * @description Duration of the charging schedule in seconds. If the duration is left empty, the last period will continue indefinitely or until end of the transaction in case startSchedule is absent.
       */
      duration?: number;
      /** Format: date-time */
      startSchedule?: string;
      /**
       * @description The unit of measure Limit is expressed in.
       * @enum {string}
       */
      chargingRateUnit: "W" | "A";
      /**
       * Format: int32
       * @description Start of the period, in seconds from the start of schedule. The value of StartPeriod also defines the stop time of the previous period.
       */
      startPeriod?: number;
      /**
       * Format: double
       * @description Charging rate limit during the schedule period, in the applicable chargingRateUnit, for example in Amperes or Watts.
       */
      limit?: number;
      /**
       * Format: int32
       * @description The number of phases that can be used for charging. If a number of phases is needed, numberPhases=3 will be assumed unless another number is given.
       */
      numberPhases?: number;
      /**
       * Format: double
       * @description Minimum charging rate supported by the electric vehicle. The unit of measure is defined by the chargingRateUnit. This parameter is intended to be used by a local smart charging algorithm to optimize the power allocation for in the case a charging process is inefficient at lower charging rates.
       */
      minChargingRate?: number;
    };
    ChargingProfile: {
      /**
       * Format: int32
       * @description Unique identifier for this profile.
       */
      chargingProfileId: number;
      /** @description Only valid if ChargingProfilePurpose is set to TxProfile, the transactionId MAY be used to match the profile to a specific transaction. */
      transactionId?: string;
      /**
       * Format: int32
       * @description Value determining level in hierarchy stack of profiles. Higher values have precedence over lower values. Lowest level is 0.
       */
      stackLevel: number;
      /**
       * @description Defines the purpose of the schedule transferred by this message.
       * @enum {string}
       */
      chargingProfilePurpose:
        | "ChargePointMaxProfile"
        | "TxDefaultProfile"
        | "TxProfile";
      /**
       * @description Indicates the kind of schedule.
       * @enum {string}
       */
      chargingProfileKind: "Absolute" | "Recurring" | "Relative";
      /**
       * @description Indicates the start point of a recurrence.
       * @enum {string}
       */
      recurrencyKind?: "Daily" | "Weekly";
      /**
       * Format: date-time
       * @description Point in time at which the profile starts to be valid. If absent, the profile is valid as soon as it is received by the Charge Point.
       */
      validFrom?: string;
      /**
       * Format: date-time
       * @description Point in time at which the profile stops to be valid. If absent, the profile is valid until it is replaced by another profile.
       */
      validTo?: string;
      chargingSchedule: components["schemas"]["ChargingSchedule"];
    };
    SetChargingProfile: {
      /**
       * Format: int32
       * @description The connector to which the charging profile applies. If connectorId = 0,the message contains an overall limit for the Charge Point.
       */
      connectorId: number;
      csChargingProfiles: components["schemas"]["ChargingProfile"];
    };
    SetChargingProfileResponse: {
      /**
       * @description Returns whether the Charge Point has been able to process the message successfully. This does not guarantee the schedule will be followed to the letter. There might be other constraints the Charge Point may need to take into account.
       *
       * @enum {string}
       */
      status: "Accepted" | "Rejected" | "NotSupported";
    };
    ChargePointListResponse: components["schemas"]["ChargeStation"][];
    PriceComponent: {
      tax?: number;
      step_size?: number;
      type?: string;
      price?: number;
    }[];
    RateObject: {
      currency?: string;
      price_components?: components["schemas"]["PriceComponent"];
    };
    Connector: {
      active?: boolean;
      status?: string;
      type?: string;
      format?: string;
      power_type?: string;
      power?: number;
      chargestation?: string;
      rate?: components["schemas"]["RateObject"];
    };
    BootInfo: {
      chargeBoxSerialNumber?: string;
      chargePointModel?: string;
      chargePointSerialNumber?: string;
      chargePointVendor?: string;
      firmwareVersion?: string;
      iccid?: string;
      imsi?: string;
    };
    ChargeStation: {
      location?: string;
      protocol?: string;
      endpoint?: string;
      static_endpoint?: string;
      online?: boolean;
      active?: boolean;
      public?: boolean;
      model?: string;
      bootInfo?: components["schemas"]["BootInfo"];
      /**
       * @example [
       *   4.865672799999999,
       *   52.3310936
       * ]
       */
      coordinates?: unknown[];
      connectors?: components["schemas"]["Connector"][];
      lastConnectAt?: string;
      lastDisconnectAt?: string;
      lastMessageAt?: string;
    };
    RemoteStartTransactionJson: {
      /**
       * Format: int32
       * @description Number of the connector on which to start the transaction. connectorId SHALL be > 0.
       */
      connectorId?: number;
      /** @description The identifier that Charge Point must use to start a transaction. */
      idTag: string;
      chargingProfile?: components["schemas"]["ChargingProfile"];
    };
    RemoteStartTransactionResponse: {
      /**
       * @description Status indicating whether Charge Point accepts the request to stop a transaction.
       * @enum {string}
       */
      status: "Accepted" | "Rejected";
    };
    RemoteStopTransaction: {
      /** @description The identifier of the transaction which Charge Point is requested to stop. */
      transactionId: string;
    };
    RemoteStopTransactionResponse: {
      /**
       * @description Status indicating whether Charge Point accepts the request to stop a transaction.
       * @enum {string}
       */
      status: "Accepted" | "Rejected";
    };
    StartTransactionRequest: {
      connectorId: number;
      idTag: string;
      meterStart: number;
      reservationId?: number;
      timestamp: string;
    };
    StartTransactionResponse: {
      idTagInfo: {
        expiryDate?: string;
        parentIdTag?: string;
        /** @enum {string} */
        status: "Accepted" | "Blocked" | "Expired" | "Invalid" | "ConcurrentTx";
      };
      transactionId: string;
    };
    ReserveNowRequest: {
      connectorId: number;
      expiryDate: string;
      idTag: string;
      parentIdTag?: string;
      reservationId: number;
    };
    ReserveNowResponse: {
      /** @enum {string} */
      status: "Accepted" | "Faulted" | "Occupied" | "Rejected" | "Unavailable";
    };
    StopTransactionRequest: {
      idTag?: string;
      meterStop: number;
      /** Format: date-time */
      timestamp: string;
      transactionId: string;
      /** @enum {string} */
      reason?:
        | "EmergencyStop"
        | "EVDisconnected"
        | "HardReset"
        | "Local"
        | "Other"
        | "PowerLoss"
        | "Reboot"
        | "Remote"
        | "SoftReset"
        | "UnlockCommand"
        | "DeAuthorized";
      transactionData?: {
        /** Format: date-time */
        timestamp: string;
        sampledValue: {
          value: string;
          /** @enum {string} */
          context?:
            | "Interruption.Begin"
            | "Interruption.End"
            | "Sample.Clock"
            | "Sample.Periodic"
            | "Transaction.Begin"
            | "Transaction.End"
            | "Trigger"
            | "Other";
          /** @enum {string} */
          format?: "Raw" | "SignedData";
          /** @enum {string} */
          measurand?:
            | "Energy.Active.Export.Register"
            | "Energy.Active.Import.Register"
            | "Energy.Reactive.Export.Register"
            | "Energy.Reactive.Import.Register"
            | "Energy.Active.Export.Interval"
            | "Energy.Active.Import.Interval"
            | "Energy.Reactive.Export.Interval"
            | "Energy.Reactive.Import.Interval"
            | "Power.Active.Export"
            | "Power.Active.Import"
            | "Power.Offered"
            | "Power.Reactive.Export"
            | "Power.Reactive.Import"
            | "Power.Factor"
            | "Current.Import"
            | "Current.Export"
            | "Current.Offered"
            | "Voltage"
            | "Frequency"
            | "Temperature"
            | "SoC"
            | "RPM";
          /** @enum {string} */
          phase?:
            | "L1"
            | "L2"
            | "L3"
            | "N"
            | "L1-N"
            | "L2-N"
            | "L3-N"
            | "L1-L2"
            | "L2-L3"
            | "L3-L1";
          /** @enum {string} */
          location?: "Cable" | "EV" | "Inlet" | "Outlet" | "Body";
          /** @enum {string} */
          unit?:
            | "Wh"
            | "kWh"
            | "varh"
            | "kvarh"
            | "W"
            | "kW"
            | "VA"
            | "kVA"
            | "var"
            | "kvar"
            | "A"
            | "V"
            | "K"
            | "Celcius"
            | "Fahrenheit"
            | "Percent";
        }[];
      }[];
    };
    StopTransactionResponse: {
      idTagInfo?: {
        expiryDate?: string;
        parentIdTag?: string;
        /** @enum {string} */
        status: "Accepted" | "Blocked" | "Expired" | "Invalid" | "ConcurrentTx";
      };
    };
    TransactionList: {
      /** @description Charge point identity. */
      identity: string;
      /** Format: date-time */
      dateFrom?: string;
      /** Format: date-time */
      dateTo?: string;
    };
    TransactionListResponse: {
      TransactionList: {
        /**
         * Format: int32
         * @description Transaction ID.
         */
        id?: number;
        /** @description The identifier to which this authorization applies. */
        idTag?: string;
        identity?: string;
        serialNumber?: string;
        /** Format: int32 */
        connectorId?: number;
        /** Format: double */
        meterStart?: number;
        /** Format: double */
        meterStop?: number;
        /** Format: double */
        value?: number;
        /** Format: int32 */
        reservationId?: number;
        reason?: string;
        data?: { [key: string]: unknown };
        /** Format: date-time */
        dateStart?: string;
        /** Format: date-time */
        dateStop?: string;
      }[];
    };
    ReservationList: {
      /** @description Charge point identity. */
      identity: string;
      /** Format: date-time */
      dateFrom?: string;
      /** Format: date-time */
      dateTo?: string;
    };
    ReservationListResponse: {
      ReservationList: {
        /**
         * Format: int32
         * @description Reservation ID.
         */
        id?: number;
        /** @description The identifier to which this authorization applies. */
        idTag?: string;
        identity?: string;
        serialNumber?: string;
        /** Format: int32 */
        connectorId?: number;
        expiryDate?: string;
        /** Format: date-time */
        dateStart?: string;
        /** Format: date-time */
        dateStop?: string;
      }[];
    };
    ChangeAvailability: {
      /**
       * Format: int32
       * @description The id of the connector for which availability needs to change. Id '0' (zero) is used if the availability of the Charge Point and all its connectors needs to change.
       */
      connectorId: number;
      /**
       * @description This contains the type of availability change that the Charge Point should perform.
       * @enum {string}
       */
      type: "Inoperative" | "Operative";
    };
    AvailabilityResponse: {
      /** @enum {string} */
      status?: "Accepted" | "Rejected" | "Scheduled";
    };
    CancelReservation: {
      /**
       * Format: int32
       * @description Id of the reservation to cancel.
       */
      reservationId: number;
    };
    CancelReservationResponse: {
      /** @enum {string} */
      status: "Accepted" | "Rejected";
    };
    /**
     * @example {
     *   "serverTime": 1642521843938
     * }
     */
    ServerTime: {
      /** @description UNIX time */
      serverTime?: number;
    };
    ApiError: {
      /**
       * @description A short, summary of the problem type. Written in english and readable for engineers.
       * @example Service Unavailable
       */
      message?: string;
      /**
       * @description Error code. Can be used for translation.
       * @example error.resource.not-found
       */
      code?: string;
      /** @description The target of the error. */
      target?: string;
      /**
       * @description List of failed swagger validations.
       * @example [
       *   {
       *     "target": ".body.name",
       *     "message": "should match pattern \"^([a-zA-Z])([a-zA-Z]|\\d|\\ )*$\"",
       *     "code": "pattern.openapi.validation"
       *   },
       *   {
       *     "target": ".body.logo",
       *     "message": "should match format \"uuid\"",
       *     "code": "format.openapi.validation"
       *   }
       * ]
       */
      details?: components["schemas"]["ApiError"][];
    };
    response: {
      error?: {
        /** Format: int32 */
        code?: number;
        message?: string;
      };
    } & {
      code: unknown;
      message: unknown;
    };
    error: {
      error?: {
        /** Format: int32 */
        code?: number;
        message?: string;
      };
    } & {
      code: unknown;
      message: unknown;
    };
  };
  responses: {
    /** The specified resource was not found */
    NotFound: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Unauthorized */
    Unauthorized: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Internal error */
    InternalError: {
      content: {
        "application/json": components["schemas"]["error"];
      };
    };
    /** Request entity too large */
    RequestEntityTooLarge: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Expectation failed */
    ExpectationFailed: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Internal server error */
    InternalServerError: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Service not available */
    ServiceUnavailable: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Bad request */
    BadRequest: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Old Version received from Client */
    Conflict: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
    /** Precondition Failed */
    PreconditionFailed: {
      content: {
        "application/json": components["schemas"]["ApiError"];
      };
    };
  };
  parameters: {
    /** @description Charge point identity */
    Identity: string;
  };
}

export interface operations {
  postSaveRepo: {
    responses: {
      /** Password reset link has been sent */
      201: {
        headers: {
          Location?: string;
        };
        content: {
          "application/json": components["schemas"]["response"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      500: components["responses"]["InternalServerError"];
    };
    /** request password reset via email */
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserEmail"];
      };
    };
  };
  postLogout: {
    responses: {
      /** User has been successfully logged out */
      201: {
        headers: {
          Location?: string;
        };
        content: {
          "application/json": {
            /** Format: uuid */
            id: string;
            revision?: string;
          };
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      500: components["responses"]["InternalServerError"];
    };
    /** logout */
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserToken"];
      };
    };
  };
  updateUser: {
    responses: {
      /** User has been successfully created */
      201: {
        headers: {
          Location?: string;
        };
        content: {
          "application/json": {
            /** Format: uuid */
            id: string;
            revision?: string;
          };
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      500: components["responses"]["InternalServerError"];
    };
    /** update the user profile */
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserEntity"];
      };
    };
  };
  getSalaries: {
    parameters: {
      query: {
        /** contract type */
        contract?: string;
        /** department group */
        department?: string;
        /** department group */
        subDepartment?: string;
      };
    };
    responses: {
      /** A list of salaries */
      200: {
        content: {
          "application/json": components["schemas"]["SalaryResponse"];
        };
      };
      401: components["responses"]["Unauthorized"];
      412: components["responses"]["PreconditionFailed"];
      500: components["responses"]["InternalServerError"];
    };
  };
  getUsers: {
    responses: {
      /** A list of users */
      200: {
        content: {
          "application/json": components["schemas"]["UserList"];
        };
      };
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      412: components["responses"]["PreconditionFailed"];
      500: components["responses"]["InternalServerError"];
    };
  };
  deleteUserByName: {
    responses: {
      /** User deleted */
      204: {
        headers: {
          ETag?: string;
        };
        content: {
          "application/json": { [key: string]: unknown };
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      500: components["responses"]["InternalServerError"];
    };
    /** delete users */
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserList"];
      };
    };
  };
  getVehicles: {
    responses: {
      /** A list of vehicles */
      200: {
        content: {
          "application/json": components["schemas"]["VehicleList"];
        };
      };
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      412: components["responses"]["PreconditionFailed"];
      500: components["responses"]["InternalServerError"];
    };
  };
  postSaveVehicle: {
    responses: {
      /** Password reset link has been sent */
      201: {
        headers: {
          Location?: string;
        };
        content: {
          "application/json": components["schemas"]["response"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      500: components["responses"]["InternalServerError"];
    };
    /** add vehicle */
    requestBody: {
      content: {
        "application/json": components["schemas"]["Vehicle"];
      };
    };
  };
  TransactionList: {
    responses: {
      /** Successfully. */
      200: {
        content: {
          "application/json": components["schemas"]["TransactionListResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TransactionList"];
      };
    };
  };
  ReservationList: {
    responses: {
      /** Successfully. */
      200: {
        content: {
          "application/json": components["schemas"]["ReservationListResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReservationList"];
      };
    };
  };
  CancelReservation: {
    responses: {
      /** This indicates the success or failure of the cancelling of a reservation by Central System. */
      200: {
        content: {
          "application/json": components["schemas"]["CancelReservationResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CancelReservation"];
      };
    };
  };
  ChangeAvailability: {
    responses: {
      /** This indicates whether the Charge Point is able to perform the availability change. */
      200: {
        content: {
          "application/json": components["schemas"]["AvailabilityResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ChangeAvailability"];
      };
    };
  };
  RemoteStartTransaction: {
    responses: {
      /** This contains the field definitions of the RemoteStartTransaction.conf PDU sent from Charge Point to Central System. */
      200: {
        content: {
          "application/json": components["schemas"]["RemoteStartTransactionResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RemoteStartTransactionJson"];
      };
    };
  };
  RemoteStopTransaction: {
    responses: {
      /** This contains the field definition of the StopTransaction.conf PDU sent by the Central System to the Charge Point in response to a StopTransaction.req PDU. */
      200: {
        content: {
          "application/json": components["schemas"]["RemoteStopTransactionResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RemoteStopTransaction"];
      };
    };
  };
  StartTransaction: {
    responses: {
      /** This contains the field definitions of the RemoteStartTransaction.conf PDU sent from Charge Point to Central System. */
      200: {
        content: {
          "application/json": components["schemas"]["StartTransactionResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["StartTransactionRequest"];
      };
    };
  };
  StopTransaction: {
    responses: {
      /** This contains the field definition of the StopTransaction.conf PDU sent by the Central System to the Charge Point in response to a StopTransaction.req PDU. */
      200: {
        content: {
          "application/json": components["schemas"]["StopTransactionResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["StopTransactionRequest"];
      };
    };
  };
  SetChargingProfile: {
    responses: {
      /** This contains the field definition of the SetChargingProfile.conf PDU sent by the Charge Point to the Central System in response to a SetChargingProfile.req PDU. */
      200: {
        content: {
          "application/json": components["schemas"]["SetChargingProfileResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SetChargingProfile"];
      };
    };
  };
  SetRateObject: {
    responses: {
      /** This contains the Rate Object details */
      200: {
        content: {
          "application/json": components["schemas"]["response"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RateObject"];
      };
    };
  };
  SetConnector: {
    responses: {
      /** This contains the Connector Object details */
      200: {
        content: {
          "application/json": components["schemas"]["response"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RateObject"];
      };
    };
  };
  ChargePointList: {
    parameters: {
      query: {
        /** location */
        location?: string;
        /** model */
        model?: string;
        /** active */
        active?: boolean;
      };
    };
    responses: {
      /** Successfully. */
      200: {
        content: {
          "application/json": components["schemas"]["ChargePointListResponse"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
  };
  SetChargeStation: {
    responses: {
      /** This contains the ChargeStation Object details */
      200: {
        content: {
          "application/json": components["schemas"]["response"];
        };
      };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Unauthorized"];
      404: components["responses"]["NotFound"];
      "5XX": components["responses"]["InternalError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ChargeStation"];
      };
    };
  };
}

export interface external {}
