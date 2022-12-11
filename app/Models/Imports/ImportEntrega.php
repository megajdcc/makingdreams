<?php

namespace App\Models\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToModel;
use App\Models\Entrega;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\User;
use App\Models\Compania;
use App\Models\Destino;
use App\Models\InformacionContenedor;
use App\Models\Contenedor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\WithChunkReading;

use App\Models\Status;

use Illuminate\Support\Facades\Auth;

use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Validators\Failure;
use App\Models\Atraque;
use App\Models\{Barco,Puerto};

class ImportEntrega implements ToModel, WithHeadingRow, WithChunkReading,SkipsOnFailure,
SkipsOnError
{
    use Importable, SkipsFailures;
    
    protected Compania $compania;
    protected Destino $destino;
    protected Contenedor $contenedor;
    protected Atraque $atraque;
    protected Barco $barco;
    protected Puerto $puerto;

    protected $fallas = [];
    public $filas = 0;
    

    public function __construct()
    {
        $this->compania = new Compania();
        $this->destino = new destino();
        $this->contenedor = new Contenedor();
        $this->barco = new Barco();
        $this->puerto = new Puerto();
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function model(array $row)
    {

        $fecha_llegada = null;
        $llegada = null;

        if($row['fecha_llegada']){

            $f1 = explode('/',$row['fecha_llegada']); //[mes,dia,año]
            $fecha_llegada = $f1[2].'/'.$f1[0].'/'.$f1[1];
            $llegada = date('Y-m-d',\strtotime($fecha_llegada));

        }

        
        // $llegada = date('Y-m-d',strtotime($row['fecha_llegada']));

        $compania_id = null;    
        $destino_id = null;

        $atraque = null;
        $atraque_id = null;

        $compania_id = ($this->compania->createIfNoExist($row['compania']))->id;
        
        if($compania_id){
            $destino_id = ($this->destino->createIfNoExist($row['destino'],$compania_id))->id;
        }   

        if($row['barco'] && $llegada && $row['puerto'] && $row['viaje']){
            
            if($atraque = Atraque::where('barco_id', $this->barco->createIfNoExist($row['barco'])->id)
            ->where('llegada',$llegada)->where('puerto_id',$this->puerto->createIfNoExist($row['puerto'])->id)->where('viaje',$row['viaje'])->first()){
                $atraque_id = $atraque->id;
            }else{
                $atraque = Atraque::create([
                    'barco_id' => ($this->barco->createIfNoExist($row['barco']))->id,
                    'puerto_id' => ($this->puerto->createIfNoExist($row['puerto']))->id,
                    'llegada' => $llegada,
                    'viaje' => $row['viaje']
                ]);
                $atraque_id = $atraque->id;
            }

        }

        $entrega = Entrega::create([
                'compania_id' => $compania_id,
                'procesada' => false,
                'destino_id' => $destino_id,
                'informacion_contenedor_id' => (InformacionContenedor::create([
                    'contenedor_id' => $this->contenedor->createIfNoExist($row['contenedor'])->id,
                    'seal' => $row['seal'],
                    'fecha_demora' => (new \DateTime($llegada))->add(new \DateInterval('P10D'))->format('Y-m-d'),
                    'hazmat' => strtolower($row['hazmat']) == 'si' ? true : false,
                    'booking' => $row['booking'],
                    'viaje' => $row['viaje'],
                    'origen' => $row['origen'],
                    'atraque_id' => $atraque_id,
                    'tipo_carga' => $row['tipo_carga']
                ]))->id
            ]);

             $estado = Status::create([
                    'situacion' => 1, // 1 => Importado, 2 => por asignar, 3 => asignador , 4 => en ruta, 5 => entregado, 6 =>  en espera.
                    'entrega_id' => $entrega->id,
                    'comentario' => "Solicitud Creada",
                    'usuario_id' =>Auth::id()
                ]);
            
            $this->filas++;

            return $entrega;
        
    }

     public function onFailure(Failure ...$failures){
            
        foreach($failures as $key => $value){
            array_push($this->fallas, ['fila' => $value->row(), 'campo' => $value->attribute(), 'errors' => $value->errors()]);
        }
       
    }   


    public function getFallas(){

        return $this->fallas;

    }

    public function onError(\Throwable $e){


    }
    

}
