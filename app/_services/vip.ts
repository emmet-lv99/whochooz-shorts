import { supabase } from "@/lib/supabase";

// 코드 검증 결과 타입
export type InviteStatus =
  | "OK"
  | "GLOBAL_FULL"
  | "CODE_EXHAUSTED"
  | "INVALID";

export interface CheckInviteResult {
  status: InviteStatus;
  owner_name?: string;
}

// 가입 신청 데이터 타입
export interface VIPRegistrationData {
  phone_number: string;
  nickname: string;
  invited_by: string;
  funnel?: string;
}

// 가입 에러 타입
export type RegistrationError =
  | "GLOBAL_LIMIT_REACHED"
  | "CODE_EXHAUSTED"
  | "DUPLICATE_PHONE"
  | "UNKNOWN";

export const vipService = {
  /**
   * 초대 코드 유효성 검증
   * @param code - 초대 코드 (예: DACHAN-X7z)
   */
  async checkInviteStatus(code: string): Promise<CheckInviteResult> {
    try {
      const { data, error } = await supabase.rpc("check_invite_status", {
        input_code: code,
      });

      if (error) {
        console.error("checkInviteStatus error:", error);
        return { status: "INVALID" };
      }

      return data as CheckInviteResult;
    } catch (e) {
      console.error("checkInviteStatus exception:", e);
      return { status: "INVALID" };
    }
  },

  /**
   * VIP 가입 신청
   * @param data - 가입 정보
   */
  async register(
    data: VIPRegistrationData
  ): Promise<{ success: boolean; error?: RegistrationError; message?: string }> {
    try {
      // 디버그 로그
      console.log("register data:", {
        phone_number: data.phone_number,
        nickname: data.nickname,
        invited_by: data.invited_by,
        funnel: data.funnel || "VIP_CLUB",
      });

      const { error } = await supabase.from("pre_registrations").insert({
        phone_number: data.phone_number,
        nickname: data.nickname,
        invited_by: data.invited_by,
        funnel: data.funnel || "VIP_CLUB",
      });

      if (error) {
        console.error("register error:", error);

        // 에러 메시지 파싱
        const errorMessage = error.message?.toLowerCase() || "";

        if (errorMessage.includes("global_limit") || errorMessage.includes("1000")) {
          return {
            success: false,
            error: "GLOBAL_LIMIT_REACHED",
            message: "방금 마지막 자리가 찼습니다.",
          };
        }

        if (errorMessage.includes("exhausted") || errorMessage.includes("소진")) {
          return {
            success: false,
            error: "CODE_EXHAUSTED",
            message: "동시에 신청한 사용자가 있어 티켓이 소진되었습니다.",
          };
        }

        if (errorMessage.includes("invalid_code") || errorMessage.includes("유효하지 않은")) {
          return {
            success: false,
            error: "CODE_EXHAUSTED",
            message: "유효하지 않은 초대 코드입니다.",
          };
        }

        if (error.code === "23505" || errorMessage.includes("unique") || errorMessage.includes("duplicate")) {
          return {
            success: false,
            error: "DUPLICATE_PHONE",
            message: "이미 등록된 휴대폰 번호입니다.",
          };
        }

        return {
          success: false,
          error: "UNKNOWN",
          message: "알 수 없는 오류가 발생했습니다.",
        };
      }

      return { success: true };
    } catch (e) {
      console.error("register exception:", e);
      return {
        success: false,
        error: "UNKNOWN",
        message: "알 수 없는 오류가 발생했습니다.",
      };
    }
  },

  /**
   * 내 추천 코드 조회
   * @param phoneNumber - 휴대폰 번호
   */
  async getMyReferralCode(
    phoneNumber: string
  ): Promise<{ code: string | null; nickname?: string }> {
    try {
      const { data, error } = await supabase
        .from("pre_registrations")
        .select("my_referral_code, nickname")
        .eq("phone_number", phoneNumber)
        .single();

      if (error) {
        console.error("getMyReferralCode error:", error);
        return { code: null };
      }

      return {
        code: data?.my_referral_code || null,
        nickname: data?.nickname,
      };
    } catch (e) {
      console.error("getMyReferralCode exception:", e);
      return { code: null };
    }
  },
};

export default vipService;
