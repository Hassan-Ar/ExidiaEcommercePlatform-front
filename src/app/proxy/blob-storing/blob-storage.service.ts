import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BlobStorageService {
  apiName = 'Default';
  

  deleteImage = (name: string, containerName: string = "ecommerce", config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/blob-storage/image',
      params: { name, containerName },
    },
    { apiName: this.apiName,...config });
  

  getImage = (name: string, containerName: string = "ecommerce", config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>({
      method: 'GET',
      responseType: 'blob',
      url: '/api/app/blob-storage/image',
      params: { name, containerName },
    },
    { apiName: this.apiName,...config });
  

  getImageUrlByNameAndContainerName = (name: string, containerName: string = "ecommerce", config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/blob-storage/image-url',
      params: { name, containerName },
    },
    { apiName: this.apiName,...config });
  

  saveImage = (image: FormData, containerName: string = "ecommerce", config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/blob-storage/save-image',
      params: { containerName },
      body: image,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
