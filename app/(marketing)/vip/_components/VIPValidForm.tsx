"use client";

interface VIPValidFormProps {
  instagram: string;
  setInstagram: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  formError: string;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  formatPhoneNumber: (value: string) => string;
}

export default function VIPValidForm({
  instagram,
  setInstagram,
  phone,
  setPhone,
  formError,
  isSubmitting,
  handleSubmit,
  formatPhoneNumber,
}: VIPValidFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="glass-card p-6 space-y-4 animate-slide-up-delay-1">
        <div>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="Instagram ID (@없이 입력)"
            className="vip-input"
            autoComplete="off"
            autoCapitalize="off"
            autoFocus
          />
        </div>

        <div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            placeholder="010-1234-5678"
            className="vip-input"
            maxLength={13}
          />
        </div>

        {formError && (
          <p className="text-red-400 text-sm text-center">{formError}</p>
        )}
      </div>

      <div className="animate-slide-up-delay-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="vip-button w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              처리 중...
            </>
          ) : (
            "VIP 멤버십 활성화하기 ✨"
          )}
        </button>
      </div>
    </form>
  );
}
