<?php

namespace App\Notifications;

use App\Models\Pago;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PagoAprobado extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(protected Pago $pago)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail','database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->greeting("Hola {$notifiable->getNombreCompleto()}!")
                    ->subject('Su pago ha sido aprobado...')
                    ->line('El pago por el monto '.number_format((float) $this->pago->monto,2,'.',',').'$ Ha sido aprobado con Éxito')
                    ->line('Ya tienes derecho a tu backoffice y puedes empezar con tú primera etapa.')
                    ->line('Te deseamos el mayor de los éxitos.')
                    // ->action('Notification Action', url('/'))
                    ->salutation('Gracias por usar nuestra Aplicación!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'titulo' => 'Hola '.$notifiable->getNombreCompleto().'!',
            'avatar' => null,
            'usuario' => null,
            'mensaje' => ['El pago por el monto ' .number_format((float) $this->pago->monto, 2, '.', ',') . '$ Ha sido aprobado con Éxito', 'Ya tienes derecho a tu backoffice y puedes empezar con tú primera etapa.', 'Te deseamos el mayor de los éxitos.'],
            'type' => 'light-success', // light-info , light-success, light-danger, light-warning
            'btn' => false,
            'btnTitle' => 'Ir a mi perfil',
            'url' => ['name' => 'perfil',]
        ];
    }
}
