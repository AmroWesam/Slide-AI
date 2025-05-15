import os
import sys
import glob
import shutil
import win32com.client

def convert_pptx_to_images():
    print('Starting PowerPoint to Image conversion script')
    
    # مسار مجلد العروض التقديمية
    base_dir = os.path.dirname(__file__)
    presentation_dir = os.path.join(base_dir, 'Presentation')
    print(f'Looking for presentations in: {presentation_dir}')
    
    # التأكد من وجود المجلد
    if not os.path.exists(presentation_dir):
        print(f'Creating directory: {presentation_dir}')
        os.makedirs(presentation_dir)
    
    # البحث عن ملفات PowerPoint
    pptx_files = glob.glob(os.path.join(presentation_dir, '*.pptx'))
    if not pptx_files:
        pptx_files = glob.glob(os.path.join(presentation_dir, '*.ppt'))
    
    if not pptx_files:
        # البحث في المجلد الرئيسي
        pptx_files = glob.glob(os.path.join(base_dir, '*.pptx'))
        if not pptx_files:
            pptx_files = glob.glob(os.path.join(base_dir, '*.ppt'))
    
    if not pptx_files:
        print('Error: No PowerPoint files found!')
        files_in_dir = os.listdir(presentation_dir) if os.path.exists(presentation_dir) else []
        print(f'Files in Presentation directory: {files_in_dir}')
        files_in_base = os.listdir(base_dir)
        print(f'Files in base directory: {files_in_base}')
        return False
    
    pptx_file = pptx_files[0]
    print(f'Converting: {pptx_file}')
    
    # إنشاء مجلد مؤقت للصور الجديدة
    temp_dir = os.path.join(base_dir, "Temp_Images")
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)
    
    # تحويل العرض التقديمي إلى صور
    try:
        # فتح PowerPoint
        powerpoint = win32com.client.Dispatch('PowerPoint.Application')
        powerpoint.Visible = True
        print('Successfully created PowerPoint application')
        
        # فتح ملف العرض التقديمي
        presentation = powerpoint.Presentations.Open(pptx_file)
        num_slides = presentation.Slides.Count
        print(f'Successfully opened presentation with {num_slides} slides')
        
        # حفظ كل شريحة كصورة في المجلد المؤقت أولاً
        for i in range(1, num_slides + 1):
            # استخدام تنسيق اسم مناسب للترتيب - Slide1.jpg, Slide2.jpg
            image_name = f'Slide{i}.jpg'
            image_path = os.path.join(temp_dir, image_name)
            presentation.Slides(i).Export(image_path, 'JPG')
            print(f'Saved slide {i} to {image_path}')
        
        # إغلاق العرض التقديمي وتطبيق PowerPoint
        presentation.Close()
        powerpoint.Quit()
        
        # حذف جميع الصور القديمة من مجلد العرض بشكل أكثر شمولية
        print("Cleaning presentation directory from old images...")
        try:
            # بدلاً من المسح الفردي، نتبع نهجًا أكثر جذرية
            # 1. حفظ قائمة بجميع الملفات التي ليست صور في مجلد العرض
            non_image_files = []
            if os.path.exists(presentation_dir):
                for file in os.listdir(presentation_dir):
                    if not file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                        file_path = os.path.join(presentation_dir, file)
                        if os.path.isfile(file_path):
                            with open(file_path, 'rb') as f:
                                content = f.read()
                            non_image_files.append((file, content))
                            print(f"Saved non-image file: {file}")

            # 2. تفريغ محتويات المجلد بالكامل
            if os.path.exists(presentation_dir):
                shutil.rmtree(presentation_dir)
            os.makedirs(presentation_dir)
            print(f"Completely refreshed presentation directory: {presentation_dir}")
            
            # 3. إعادة الملفات غير الصور
            for file_name, content in non_image_files:
                destination_path = os.path.join(presentation_dir, file_name)
                with open(destination_path, 'wb') as f:
                    f.write(content)
                print(f"Restored non-image file: {file_name}")
        except Exception as e:
            print(f"Error while cleaning presentation directory: {e}")
            import traceback
            print(traceback.format_exc())
            # إنشاء المجلد إذا لم يكن موجوداً
            if not os.path.exists(presentation_dir):
                os.makedirs(presentation_dir)
        
        # نقل الصور الجديدة من المجلد المؤقت إلى مجلد العرض
        successful_copies = 0
        for file in sorted(os.listdir(temp_dir), key=len):
            src_path = os.path.join(temp_dir, file)
            dst_path = os.path.join(presentation_dir, file)
            try:
                shutil.copy2(src_path, dst_path)
                successful_copies += 1
                print(f'Copied {file} to presentation directory')
            except Exception as e:
                print(f'Error copying {file}: {e}')
        
        # حذف المجلد المؤقت
        shutil.rmtree(temp_dir)
        
        # التحقق من الصور المنقولة
        image_files = sorted([f for f in os.listdir(presentation_dir) if f.lower().endswith('.jpg')], key=len)
        print(f'Conversion complete! Created {len(image_files)} images:')
        print(image_files)
        
        # إنشاء ملف batch لتشغيل main.py بشكل صحيح
        batch_path = os.path.join(base_dir, "start_presentation.bat")
        with open(batch_path, 'w') as f:
            f.write('@echo off\n')
            f.write(f'cd /d "{base_dir}"\n')
            f.write('python main.py\n')
        print(f"Created launcher script: {batch_path}")
        print("Please run this script to start the presentation after conversion.")
        
        # قراءة محتويات المجلد بعد الانتهاء - هذه خطوة مهمة للتأكد من أن main.py سيجد الملفات
        print("Contents of Presentation directory after conversion:")
        for file in sorted(os.listdir(presentation_dir), key=len):
            print(f"  - {file}")
        
        return successful_copies > 0 and len(image_files) > 0
    except Exception as e:
        print(f'Error during conversion: {e}')
        import traceback
        print(traceback.format_exc())
        try:
            # محاولة إغلاق PowerPoint في حالة حدوث خطأ
            if 'presentation' in locals():
                try:
                    presentation.Close()
                except:
                    pass
            if 'powerpoint' in locals():
                try:
                    powerpoint.Quit()
                except:
                    pass
            # محاولة تنظيف المجلد المؤقت في حالة حدوث خطأ
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
        except Exception as close_error:
            print(f'Error during cleanup: {close_error}')
        return False

if __name__ == "__main__":
    print("Starting PowerPoint to Image conversion")
    success = convert_pptx_to_images()
    print(f"Script execution completed. Success: {success}")
