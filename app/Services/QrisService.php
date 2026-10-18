<?php

namespace App\Services;

use Exception;

class QrisService
{
    protected string $staticPayload;

    public function __construct(?string $staticPayload = null)
    {
        $this->staticPayload = $staticPayload 
            ?: (string) config('services.qris.static_payload', env('QRIS_STATIC_PAYLOAD', ''));
    }

    /**
     * Ubah payload QRIS statis menjadi QRIS dinamis dengan nominal terisi otomatis.
     */
    public function generateDynamicQris(int|float $amount): string
    {
        $payload = trim($this->staticPayload);

        if (empty($payload)) {
            throw new Exception('QRIS Static Payload belum dikonfigurasi di file .env');
        }

        // 1. Hapus CRC tag lama di akhir (4 karakter hex terakhir)
        $body = substr($payload, 0, -4);
        if (str_ends_with($body, '6304')) {
            $body = substr($body, 0, -4);
        }

        // 2. Ubah indikator initiation method dari 010211 (Statis) menjadi 010212 (Dinamis)
        if (str_contains($body, '010211')) {
            $body = str_replace('010211', '010212', $body);
        }

        // 3. Format tag 54 (Transaction Amount)
        // Standar IDR QRIS tidak menggunakan desimal jika nominal bulat
        $amountStr = (string) ((int) round($amount));
        $amountTag = '54' . str_pad((string) strlen($amountStr), 2, '0', STR_PAD_LEFT) . $amountStr;

        // 4. Sisipkan tag 54 sebelum tag 58 (Country Code: 5802ID)
        $tag58Pos = strpos($body, '5802ID');
        if ($tag58Pos !== false) {
            $body = substr($body, 0, $tag58Pos) . $amountTag . substr($body, $tag58Pos);
        } else {
            // Fallback jika tidak menemukan tag 5802ID
            $body .= $amountTag;
        }

        // 5. Tambahkan tag 6304 (CRC) dan hitung ulang checksum CRC16
        $toChecksum = $body . '6304';
        $crc = $this->calculateCrc16($toChecksum);

        return $toChecksum . $crc;
    }

    /**
     * Hitung checksum CRC16 CCITT (Polynom 0x1021, Init 0xFFFF)
     */
    public function calculateCrc16(string $str): string
    {
        $crc = 0xFFFF;
        $len = strlen($str);

        for ($c = 0; $c < $len; $c++) {
            $crc ^= ord($str[$c]) << 8;
            for ($i = 0; $i < 8; $i++) {
                if (($crc & 0x8000) !== 0) {
                    $crc = (($crc << 1) ^ 0x1021) & 0xFFFF;
                } else {
                    $crc = ($crc << 1) & 0xFFFF;
                }
            }
        }

        return strtoupper(str_pad(dechex($crc & 0xFFFF), 4, '0', STR_PAD_LEFT));
    }
}
