import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AssistComponent } from './pages/assist/assist.component';
//Llamado de las rutas
export const routes: Routes = [
    {path:'', component: HomeComponent },
    {path:'productos', component: ProductsComponent },
    {path:'asistencia', component: AssistComponent },
    {path:'**', redirectTo: '' }
];
