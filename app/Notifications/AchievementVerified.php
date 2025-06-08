<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\AchievementModel;

class AchievementVerified extends Notification implements ShouldQueue
{
    use Queueable;

    protected $achievement;
    protected $status;
    protected $reason;

    public function __construct(AchievementModel $achievement, string $status, ?string $reason = null)
    {
        $this->achievement = $achievement;
        $this->status = $status;
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        $message = $this->status === 'accepted'
            ? "Prestasi tim {$this->achievement->userToCompetition->name} telah diverifikasi dan diterima."
            : "Prestasi tim {$this->achievement->userToCompetition->name} telah ditolak.";

        if ($this->reason) {
            $message .= " Alasan: {$this->reason}";
        }

        return (new MailMessage)
            ->subject('Verifikasi Prestasi')
            ->line($message)
            ->line('Detail Prestasi:')
            ->line("Nama: {$this->achievement->name}")
            ->line("Juara: {$this->achievement->champion}")
            ->line("Skor: {$this->achievement->score}")
            ->action('Lihat Detail', route('dosen.achievements.detail', $this->achievement->id));
    }

    public function toArray($notifiable)
    {
        return [
            'achievement_id' => $this->achievement->id,
            'team_name' => $this->achievement->userToCompetition->name,
            'status' => $this->status,
            'reason' => $this->reason,
            'message' => $this->status === 'accepted'
                ? "Prestasi tim {$this->achievement->userToCompetition->name} telah diverifikasi dan diterima."
                : "Prestasi tim {$this->achievement->userToCompetition->name} telah ditolak."
        ];
    }
}